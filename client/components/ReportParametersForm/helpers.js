
import get from 'lodash/get';

const formParamsMapping = {
  onlineBooking: {
    start_date: 'dateRange.fromDate',
    end_date: 'dateRange.toDate',
    category: 'categories',
    group_by: 'dateRangeFilter',
  },
  donnasReminders: {
    start_date: 'dateRange.fromDate',
    end_date: 'dateRange.toDate',
    GroupBy: 'dateRangeFilter',
  },
  donnasRecalls: {
    start_date: 'dateRange.fromDate',
    end_date: 'dateRange.toDate',
    group_by: 'dateRangeFilter',
  },
  donnasReviews: {
    start_date: 'dateRange.fromDate',
    end_date: 'dateRange.toDate',
    GroupBy: 'dateRangeFilter',
  },
  totalProduction: {
    start_date: 'dateRange.fromDate',
    end_date: 'dateRange.toDate',
    GroupBy: 'dateRangeFilter',
    compare: 'showComparisons',
  },
};

/**
 * function used to map the field names required by ModeReport with field names used in components.
 * @param page
 * @param pageParams
 * @return {any}
 */
export default (page, pageParams) => {
  const pageFormFields = formParamsMapping[page];
  const result = Object.entries(pageFormFields).map(([key, value]) => ({
    [key]: get(pageParams, value),
  }));
  return Object.assign(...result);
};
