
import moment from 'moment';
import { Patient } from '../../_models';

export function PatientSearchFirstLastName({ data, key }, filterIds, query, accountId) {
  const searchString = data[0] || '';
  const search = searchString.split(' ');

  let prevFilterIds = { id: { $not: null } };

  if (filterIds && filterIds.length) {
    prevFilterIds = {
      id: filterIds,
    };
  }

  const searchClause = {
    where: {
      accountId,
      ...prevFilterIds,
      $or: [],
    },
    raw: true,
  };

  const mergeObj = {};
  mergeObj[key] = { $iLike: `${search[0]}%` }
  searchClause.where.$or.push(mergeObj);


  return Patient.findAndCountAll(Object.assign({
    ...query,
  }, searchClause))
    .then((patientData) => {
      const patients = patientData.rows;

      const beginningCheck1 = new RegExp(`^${search[0]}`, 'i');
      console.log('beginnginchec', beginningCheck1)

      const anyCheck1 = new RegExp(search[0], 'i');

      const word1Length = search[0].length;

      const patientsSort = patients.sort((a, b) => {
        let aValue = 0;
        let bValue = 0;

        aValue += (beginningCheck1.test(a.firstName) ? word1Length + 1 : 0);
        aValue += (anyCheck1.test(a.firstName) ? word1Length + 1 : 0);

        bValue += (beginningCheck1.test(b.firstName) ? word1Length + 1 : 0);
        bValue += (anyCheck1.test(b.firstName) ? word1Length + 1 : 0);


        return bValue - aValue;
      });
      return {
        rows: patientsSort,
        count: patientData.count,
      };
    });
}

export function PatientSearch(value, accountId, searchQuery, filterIds) {
  const searchString = value || '';
  const search = searchString.split(' ');

  // making search case insensitive as
  const phoneSearch = `%${search[0].replace(/\D/g, '')}`;

  let prevFilterIds = { id: { $not: null } };

  if (filterIds && filterIds.length) {
    prevFilterIds = {
      id: filterIds,
    };
  }

  let searchClause;
  if (search[1]) {
    searchClause = {
      where: {
        accountId,
        $or: [
          { firstName: { $iLike: `%${search[0]}%` }, lastName: { $iLike: `%${search[1]}%` } },
          { firstName: { $iLike: `%${search[1]}%` }, lastName: { $iLike: `%${search[0]}%` } },
        ],
      },
    };
  } else {
    searchClause = {
      where: {
        accountId,
        ...prevFilterIds,
        $or: [
          { firstName: { $iLike: `%${search[0]}%` } },
          { lastName: { $iLike: `%${search[0]}%` } },
          //{ email: { $iLike: `%${search[0]}%` } },
        ],
      },
    };
    /*
    if (phoneSearch !== '%') {
      searchClause.where.$or.push({ mobilePhoneNumber: { $like: phoneSearch } });
      searchClause.where.$or.push({ homePhoneNumber: { $like: phoneSearch } });
      searchClause.where.$or.push({ workPhoneNumber: { $like: phoneSearch } });
      searchClause.where.$or.push({ otherPhoneNumber: { $like: phoneSearch } });
    }*/
  }

  return Patient.findAndCountAll(Object.assign({
    ...searchQuery,
  }, searchClause))
  .then((patientData) => {
    const patients = patientData.rows;
    const beginningCheck1 = new RegExp(`^${search[0]}`, 'i');
    const beginningCheck2 = search[1] ? new RegExp(`${search[0]}`, 'i') : null;

    const anyCheck1 = new RegExp(search[0], 'i');
    const anyCheck2 = search[1] ? new RegExp(search[0], 'i') : null;

    const word1Length = search[0].length;
    const word2Length = search[1] ? search[1].length : null;

    const patientsSort = patients.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      aValue += (beginningCheck1.test(a.firstName) ? word1Length + 1 : 0);
      aValue += (anyCheck1.test(a.firstName) ? word1Length + 1 : 0);
      aValue += (beginningCheck1.test(a.lastName) ? word1Length : 0);
      aValue += (anyCheck1.test(a.lastName) ? word1Length : 0);

      bValue += (beginningCheck1.test(b.firstName) ? word1Length + 1 : 0);
      bValue += (anyCheck1.test(b.firstName) ? word1Length + 1 : 0);
      bValue += (beginningCheck1.test(b.lastName) ? word1Length : 0);
      bValue += (anyCheck1.test(b.lastName) ? word1Length : 0);

      if (search[1]) {
        aValue += (beginningCheck2.test(a.firstName) ? word2Length : 0);
        aValue += (anyCheck2.test(a.firstName) ? word2Length : 0);
        aValue += (beginningCheck2.test(a.lastName) ? word2Length : 0);
        aValue += (anyCheck2.test(a.lastName) ? word2Length : 0);

        bValue += (beginningCheck2.test(b.firstName) ? word2Length : 0);
        bValue += (anyCheck2.test(b.firstName) ? word2Length : 0);
        bValue += (beginningCheck2.test(b.lastName) ? word2Length : 0);
        bValue += (anyCheck2.test(b.lastName) ? word2Length : 0);
      }

      return bValue - aValue;
    });
    return {
      rows: patientsSort,
      count: patientData.count,
    };
  });
}
