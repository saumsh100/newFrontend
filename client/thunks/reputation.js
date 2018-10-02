
import { setReputationFilter } from '../actions/reputation';
import { setReviewsData } from '../reducers/reputation';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';

export default function setReputationState(params) {
  return async function (dispatch, getState) {
    await dispatch(fetchEntitiesRequest({
      id: 'reviews',
      url: '/api/reputation/reviews',
      params,
    }));

    const { apiRequests } = getState();
    const reviewsData = apiRequests.get('reviews').data;
    const reviews = reviewsData.get('reviews').toJS();

    const sourceNames = {};
    const ratingObj = {};

    const reviewsList = reviews.map((review) => {
      const name = review.sourceName.replace('.ca', '');
      const { rating } = review;

      if (!(name in sourceNames)) {
        sourceNames[name] = 1;
      } else {
        sourceNames[name] += 1;
      }

      if (!(rating in ratingObj)) {
        ratingObj[rating] = 1;
      } else {
        ratingObj[rating] += 1;
      }

      return {
        ...review,
        sourceName: name,
      };
    });

    const ratings = ['0', '1', '2', '3', '4', '5'];

    const filterData = {
      sources: Object.keys(sourceNames),
      ratings,
    };

    dispatch(setReviewsData({
      reviewsList,
      reviewsData: reviewsData.get('data').toJS(),
    }));

    return dispatch(setReputationFilter({
      key: 'reviewsFilter',
      filterData,
    }));
  };
}
