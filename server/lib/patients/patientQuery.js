
import moment from 'moment';
import { Appointment, Patient, DeliveredProcedure, Request sequelize } from '../../_models';
import { LateAppointmentsFilter, CancelledAppointmentsFilter, UnConfirmedPatientsFilter, MissedPreAppointed } from './smartFilters';
import { mostBusinessSinglePatient } from '../intelligence/revenue';
import PatientSearch from './patientSearch';

function ManualLimitOffset(eventsArray, query) {
  const {
    limit,
    offset,
  } = query;

  let filterArray = eventsArray;

  if (offset && eventsArray.length > offset) {
    filterArray = filterArray.slice(offset, eventsArray.length);
  }

  if (limit) {
    filterArray = filterArray.slice(0, limit);
  }

  return filterArray;
}

function getIds(patients, key) {
  return patients.map((patient) => {
    return patient[key]
  });
}

function DemographicsFilter(values, patients, query, accountId) {
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
  if (patients && patients.length) {
    const patientIds = getIds(patients);
    idData.id = patientIds;
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
    include,
    offset,
    limit,
    order,
  });
}

async function AppointmentsFilter(values, filteredPatients, query, accountId) {
  try {
    const {
      firstAppointment,
      lastAppointment,
      appointmentsCount,
      production,
      onlineAppointments,
    } = values;

    const {
      limit,
      order,
      offset,
      include,
    } = query;

    let patientsData;

    const searchFirstLastObj = {
      raw: true,
      where: {
        accountId,
      },
      include: [],
      limit,
      offset,
    };

    if (firstAppointment) {
      searchFirstLastObj.include.push({
        model: Appointment,
        as: 'firstAppt',
        where: {
          startDate: {
            $between: [firstAppointment[0], firstAppointment[1]],
          },
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],
      });
    }


    if (lastAppointment) {
      searchFirstLastObj.include.push({
        model: Appointment,
        as: 'lastAppt',
        where: {
          startDate: {
            $between: [lastAppointment[0], lastAppointment[1]],
          },
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],
      });
    }

    if (lastAppointment && firstAppointment) {
      searchFirstLastObj.include.push(include[0]);
    } else if (!lastAppointment && firstAppointment) {
      searchFirstLastObj.include.concat(include);
    }

    patientsData = ((lastAppointment || firstAppointment) ?
      await Patient.findAndCountAll(searchFirstLastObj) : null);

    let patientIds = patientsData ? getIds(patientsData.rows, 'id') : { $not: null };

    if (appointmentsCount) {
      const data = await Appointment.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isDeleted: false,
          isPending: false,
          patientId: patientIds,
        },
        group: ['patientId'],
        attributes: ['patientId', [sequelize.fn('COUNT', 'patientId'), 'PatientCount']],
        having: sequelize.literal(`count("patientId") ${appointmentsCount[0]} ${appointmentsCount[1]}`),
      });

      patientIds = getIds(data, 'patientId');

      const searchCountObj = {
        raw: true,
        where: {
          accountId,
          id: patientIds,
        },
        include,
        limit,
        offset,
      };
      patientsData = await Patient.findAndCountAll(searchCountObj);
    }


    if (production) {
      const data = await Patient.findAll({
        where: {
          accountId,
          id: patientIds,
        },
        attributes: [
          'Patient.id',
          [sequelize.fn('sum', sequelize.col('deliveredProcedures.totalAmount')), 'totalAmount'],
        ],
        include: [
          {
            model: DeliveredProcedure,
            as: 'deliveredProcedures',
            where: {
              entryDate: {
                gt: moment('1970-01-01').toISOString(),
                lt: new Date(),
              },
            },
            attributes: [],
            duplicating: false,
            required: true,
          },
        ],
        group: ['Patient.id'],
        having: sequelize.literal(`sum("totalAmount") > ${10000}`),
        raw: true,
      });

      patientIds = getIds(data, 'id');

      const searchRevenueObj = {
        raw: true,
        where: {
          accountId,
          id: patientIds,
        },
        include,
        limit,
        offset,
      };
      patientsData = await Patient.findAndCountAll(searchRevenueObj);
    }

    if (onlineAppointments) {
      /*const data = await Request.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isConfirmed: true,
        },
        include: [{
          model: Patient,
          where: {
            patientUserId: {
              $not: null
            }
          }
        }]
      });*/
    }

    return patientsData;
  } catch (err) {
    console.log(err);
  }
}

const filterFunctions = {
  Demographics: DemographicsFilter,
  Appointments: AppointmentsFilter,
};

const smartFilterFunctions = [
  LateAppointmentsFilter,
  CancelledAppointmentsFilter,
  MissedPreAppointed,
  UnConfirmedPatientsFilter,
];

export async function PatientQuery(config) {
  try {
    const start = Date.now();
    console.log('Table API Started');

    const {
      limit,
      filters,
      smartFilter,
      search,
      sort,
      page,
      accountId,
    } = config;

    const filterBy = {
      accountId,
    };

    /**
     * Sorting By
     */
    const order = [];
    const offset = limit * page;

    if (sort && sort.length) {
      const sortObj = JSON.parse(sort[0]);

      const descOrAsc = sortObj.desc ? 'DESC' : 'ASC';
      order.push([sortObj.id, descOrAsc]);
    }

    const includeArray = [{
      model: Appointment,
      as: 'nextAppt',
      attributes: ['startDate'],
      groupBy: ['startDate'],
      required: false,
    }, {
      model: Appointment,
      as: 'lastAppt',
      attributes: ['startDate'],
      required: false,
      groupBy: ['startDate'],
    }];

    const defaultQuery = {
      raw: true,
      where: filterBy,
      include: includeArray,
      offset,
      limit,
      order,
    };

    /**
     * Applying Filters
     */
    let filteredPatients = [];
    let patientCount = 0;
    let smFilter = null;

    if (smartFilter) {
      smFilter = JSON.parse(smartFilter);
      const offSetLimit = {
      };

      if (!filters) {
        offSetLimit.offset = offset;
        offSetLimit.limit = limit;
      }

      filteredPatients = await smartFilterFunctions[smFilter.index](accountId, offSetLimit, order, smFilter);
    }


    if (filters && filters.length) {
      const runFilters = filters.map(async (filter) => {
        const filterObj = JSON.parse(filter);
        const patients = await filterFunctions[filterObj.type](filterObj.values, filteredPatients.patients, defaultQuery, accountId);
        return patients;
      });
      const data = await Promise.all(runFilters);
      filteredPatients = data[0].rows;
      patientCount = data[0].count;
    }

    /**
     * Searching patients and displaying filtered patients
     */
    let patients = null;

    if (!search && !smartFilter && !(filters && filters.length)) {
      patientCount = await Patient.count({
        where: filterBy,
        order,
      });

      patients = await Patient.findAll({
        ...defaultQuery,
      });
    } else if (smartFilter && !filters) {
      patientCount = filteredPatients.count;

      patients = filteredPatients.rows.map(data => smFilter.joinFilter ? data.patient : data);
    } else if (filters.length) {
      patients = filteredPatients;
    } else {
      patients = await PatientSearch(search, accountId, defaultQuery);

      patientCount = patients.length;
    }

    console.log(`--- ${Date.now() - start}ms elapsed patientFindAll`);

    /**
     * Calculating Revenue
     */
    const calcPatientRevenue = patients.map(async (patient) => {
      try {
        const productionRevenue = await mostBusinessSinglePatient(moment('1970-01-01').toISOString(), new Date(), accountId, patient.id)

        if (productionRevenue && productionRevenue.length) {
          patient.totalAmount = productionRevenue[0].totalAmount;
        }
        patient.totalPatients = patientCount;
        return patient;
      } catch (error) {
        throw error;
      }
    });

    return await Promise.all(calcPatientRevenue);
  } catch (error) {
    throw error;
  }
}
