
import moment from 'moment';
import { Patient } from '../../_models';

export function DemographicsFilter({ data }, filterIds, query, accountId) {
  const {
    ageStart,
    ageEnd,
    city,
    gender,
  } = data;

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

  return Patient.findAndCountAll({
    raw: true,
    where: Object.assign(idData,
      searchClause),
    ...query,
  });
}
