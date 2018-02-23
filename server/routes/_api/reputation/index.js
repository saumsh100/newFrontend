
import moment from 'moment';
import { Router } from 'express';
import axios from 'axios';
import toArray from 'lodash/toArray';
import orderBy from 'lodash/orderBy';
import sortBy from 'lodash/sortBy';
import checkPermission from '../../../middleware/checkPermissions';
import globals from '../../../config/globals';
import StatusError from '../../../util/StatusError';
import { Account, Review, Patient } from '../../../_models';

const reputationRouter = Router();

const VENDASTA_LISTINGS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/getStats/';
const VENDASTA_LISTINGS_ACCOUNT = 'https://reputation-intelligence-api.vendasta.com/api/v2/account/get/';
const VENDASTA_LISTINGS_SEARCH = 'https://reputation-intelligence-api.vendasta.com/api/v2/listing/lookupListings/';

const VENDASTA_REVIEWS_URL = 'https://reputation-intelligence-api.vendasta.com/api/v2/review/getStats/';
const VENDASTA_REVIEWS_LOOKUP = 'https://reputation-intelligence-api.vendasta.com/api/v3/review/search/';

const {
  apiKey,
  apiUser,
} = globals.vendasta;

const fetchListingsData = (account) => {
  const listingsUrl = `${VENDASTA_LISTINGS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchListingsInfo = (account) => {
  const listingsUrl = `${VENDASTA_LISTINGS_ACCOUNT}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchListingsSearch = (account) => {
  const listingsUrl = `${VENDASTA_LISTINGS_SEARCH}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return axios.post(listingsUrl, { customerIdentifier: account.vendastaId });
};

const fetchReviewsData = async (account) => {
  const reviewsUrl = `${VENDASTA_REVIEWS_URL}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return await axios.post(reviewsUrl, { customerIdentifier: account.vendastaId });
};

const fetchReviewsLookup = async (account, minDateTime, maxDateTime) => {
  const reviewsUrl = `${VENDASTA_REVIEWS_LOOKUP}?apiKey=${apiKey}&apiUser=${apiUser}`;
  return await axios.post(reviewsUrl, {
    customerIdentifier: account.vendastaId,
    pageSize: 500,
    // We have this commented out because we have to order ourselves anyways
    // orderBy: 'publishedDateTimeDesc',
    minDateTime,
    maxDateTime,
  });
};

reputationRouter.get('/listings', checkPermission('listings:read'), (req, res, next) => {
  return Account.findById(req.accountId).then((accountModel) => {
    const account = accountModel.get({ plain: true });
    fetchListingsData(account)
      .then((respData) => {
        fetchListingsInfo(account)
        .then((respInfo) => {
          fetchListingsSearch(account)
           .then((respSearch) => {
             respSearch.data.accountInfo = respInfo.data.data;
             respSearch.data.searchData = respSearch.data.data;
             respSearch.data.data = respData.data.data;
             return res.send(respSearch.data);
           });
        });
      }).catch((e) =>  {
      return res.sendStatus(400);
    });
  }).catch(error => next(error));
});

/*reputationRouter.get('/reviews', checkPermission('reviews:read'), (req, res, next) => {
  const {
    startDate = moment().subtract(900, 'days')._d,
    endDate = moment()._d
  } = req.query;

  return Account.findById(req.accountId).then((accountModel) => {
    const account = accountModel.get({ plain: true });
    fetchReviewsLookup(account, moment(startDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]'), moment(endDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]'))
    .then((resp) => {
      fetchReviewsData(account)
        .then((response) => {
          response.data.reviews = resp.data.data;
          return res.send(response.data);
        })
    }).catch((e) => {
      return res.sendStatus(404);
    });
  }).catch(error => next(error));
});*/

/**
 * GET /reviews
 *
 * - Get all reviews during date range from Vendasta
 * - Get all reviews during date range from CareCru
 * - Transform CareCru reviews into Vendasta form (easier for client-side)
 * - Compute any new totals
 */
reputationRouter.get('/reviews', checkPermission('reviews:read'), async (req, res, next) => {
  try {
    // Default query is 3 years?
    const {
      startDate,
      endDate,
    } = req.query;

    const account = await Account.findById(req.accountId);
    if (!account) return next(StatusError(404, `Account with id=${req.accountId} not found`));
    if (!account.vendastaId) return next(StatusError(404, `Account with id=${req.accountId} has no vendastaId`));

    const minDateTime = startDate ? moment(startDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]') : null;
    const maxDateTime = endDate? moment(endDate).format('YYYY-MM-DD[T]HH:mm:ss[Z]') : null;

    const vendastaReviews = await fetchReviewsLookup(
      account,
      minDateTime,
      maxDateTime
    );

    const careCruReviews = await Review.findAll({
      where: {
        accountId: req.accountId,
      },

      include: [
        {
          model: Patient,
          as: 'patient',
          required: true,
        },
      ],
    });

    const parsedCareCruReviews = careCruReviews.map((ccReview) => {
      const { patient } = ccReview;
      return {
        sourceName: 'CareCru',
        domain: 'carecru.com',
        contentSnippet: ccReview.description,
        publishedDateTime: ccReview.createdAt,
        reviewId: ccReview.id,
        rating: ccReview.stars.toString(),
        reviewerName: `${patient.firstName} ${patient.lastName}`,
        patientId: patient.id,
      };
    });

    const mergedReviews = vendastaReviews.data.data.concat(parsedCareCruReviews);
    const orderedReviews = mergedReviews.sort((a, b) => moment(b.publishedDateTime).diff(a.publishedDateTime));

    // Now fetch stats as well. Could probably be separated out...
    const reviewsData = await fetchReviewsData(account);
    reviewsData.data.reviews = orderedReviews;
    res.send(reviewsData.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = reputationRouter;
