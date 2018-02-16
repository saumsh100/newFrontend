
import moment from 'moment';
import { Patient } from '../../_models';

export function DemographicsFilter({ data, key }, filterIds, query, accountId) {
  const idData = { id: { $not: null }};
  if (filterIds && filterIds.length) {
    idData.id = filterIds;
  }

  let birthDate = {};
  let address = {};
  let genderObj = {};
  let statusObj = {};

  if (key === 'age') {
    const endDate = moment().subtract(data[0], 'years').toISOString();
    const startDate = moment().subtract(data[1], 'years').toISOString();
    birthDate = {
      birthDate: {
        $between: [startDate, endDate],
      },
    };
  }

  if (key === 'city') {
    address = {
      address: {
        city: {
          $ilike: data[0],
        },
      },
    };
  }

  if (key === 'gender') {
    genderObj = {
      gender: {
        $ilike: data[0],
      },
    };
  }

  if (key === 'status') {
    statusObj = {
      status: data,
    };
  }

  const searchClause = {
    accountId,
    ...genderObj,
    ...address,
    ...birthDate,
    ...statusObj,
    ...idData,
  };

  return Patient.findAndCountAll({
    raw: true,
    where: searchClause,
    ...query,
  });
}
