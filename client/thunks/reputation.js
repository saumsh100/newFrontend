import { setReputationFilter } from '../actions/reputation';

export function setReputationFilterState() {
  return function (dispatch, getState) {
    const { apiRequests } = getState();
    const reviewsData = apiRequests.get('reviews').data;
    const reviewsList = reviewsData.get('reviews').toJS();

    const sourceNames = {};
    const ratingObj = {};

    reviewsList.map((review) => {
      const name = review.sourceName;
      const rating = review.rating;

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
    });

    const ratings = ['0','1','2','3','4','5'];

    const filterData = {
      sources: Object.keys(sourceNames),
      ratings,
    };

    return dispatch(setReputationFilter({ key: 'reviewsFilter', filterData }));
  };
}
