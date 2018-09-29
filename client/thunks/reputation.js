
import { setReputationFilter } from '../actions/reputation';
import { setReviewsData } from '../reducers/reputation';

export default function setReputationState() {
  return function (dispatch, getState) {
    const { apiRequests } = getState();
    const reviewsData = apiRequests.get('reviews').data;
    let reviewsList = reviewsData.get('reviews').toJS();

    const sourceNames = {};
    const ratingObj = {};

    reviewsList = reviewsList.map((review) => {
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
