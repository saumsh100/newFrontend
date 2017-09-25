import { setReputationFilter } from "../actions/reputation";

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

    const filterData = {
      sources: sourceNames,
      dateRange: null,
      ratings: ratingObj,
    };

    return dispatch(setReputationFilter({ key: 'reviewsFilter', filterData }));
  };
}
