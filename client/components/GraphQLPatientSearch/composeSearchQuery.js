
export default function ({ search = '', limit = 15, after, order = ['firstName', 'lastName'] }) {
  /**
   * split the search on space to look for first name and last name on the same search
   * e.g. the search "al b" will find Alejandrin Bradtke and Aliya Bayer
   */
  const splitSearch = search.split(' ').filter(v => v !== '');

  const whereClause = splitSearch[1]
    ? {
      $and: [
        { firstName: { $iLike: `${splitSearch[0]}%` } },
        { lastName: { $iLike: `${splitSearch[1]}%` } },
      ],
    }
    : {
      $or: [
        { firstName: { $iLike: `${splitSearch[0]}%` } },
        { lastName: { $iLike: `${splitSearch[0]}%` } },
        { email: { $iLike: `%${search}%` } },
        { cellPhoneNumber: { $iLike: `+1${search}%` } },
      ],
    };

  return {
    search: JSON.stringify(whereClause),
    limit,
    after,
    order,
  };
}
