
import moment from 'moment';
import { Patient } from '../../_models';

export function DemographicsFilter(values, filterIds, query, accountId, lastFilter) {
  const indexFunc = 0;
  const {
    ageStart,
    ageEnd,
    city,
    gender,
  } = values;

  const {
    limit,
    order,
    offset,
    include,
  } = query;

  const idData = {};
  if (filterIds && filterIds.length) {
    idData.id = filterIds;
  }

  let birthDate = {};
  let address = {};
  let genderObj = {};

  if (ageStart && ageEnd) {
    const endDate = moment().subtract(ageStart, 'years').toISOString();
    const startDate = moment().subtract(ageEnd, 'years').toISOString();
    birthDate = {
      birthDate: {
        $between: [startDate, endDate],
      },
    };
  }

  if (city) {
    address = {
      address: {
        city: {
          $ilike: city,
        },
      },
    };
  }

  if (gender) {
    genderObj = {
      gender: {
        $ilike: gender,
      },
    };
  }

  const searchClause = {
    accountId,
    ...genderObj,
    ...address,
    ...birthDate,
  };

  if (!lastFilter) {
    return Patient.findAndCountAll({
      raw: true,
      where: Object.assign(idData,
        searchClause),
      attributes: ['id'],
      groupBy: ['id'],
      offset,
      order,
    });
  }

  return Patient.findAndCountAll({
    raw: true,
    where: Object.assign(idData,
      searchClause),
    include,
    offset,
    limit,
    order,
  });
}
