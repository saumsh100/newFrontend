
import { Router } from 'express';
import moment from 'moment';
import { mostBusinessSinglePatient } from '../../../lib/intelligence/revenue';
import PatientSearch from '../../../lib/patientSearch';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, Patient, sequelize, DeliveredProcedure, Request } from '../../../_models';

const tableRouter = new Router();

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

async function AppointmentsFilter(values, filteredPatients, query, accountId,  next) {
  try {
    const {
      firstAppointment,
      lastAppointment,
      treatment,
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

    let patientsData = null;
    const keys = Object.keys(values);

    if (firstAppointment) {
      let searchObj = {
        raw: true,
        where: {
          accountId,
        },
        include: [{
          model: Appointment,
          as: 'firstAppt',
          where: {
            startDate: {
              $between: [firstAppointment[0], firstAppointment[1]],
            },
          },
          attributes: ['startDate'],
          groupBy: ['startDate'],
        }].concat(include),
      };

      searchObj = keys.length === 1 ? Object.assign(searchObj, { limit }, { offset }) : searchObj;
      patientsData = await Patient.findAndCountAll(searchObj);
    }

    if (lastAppointment) {
      let searchObj = {
        raw: true,
        where: {
          accountId,
        },
        include: [{
          model: Appointment,
          as: 'lastAppt',
          where: {
            startDate: {
              $between: [lastAppointment[0], lastAppointment[1]],
            },
          },
          attributes: ['startDate'],
          groupBy: ['startDate'],
        }].concat(include.slice(0, 1)),
      };

      searchObj = keys.length === 1 ? Object.assign(searchObj, { limit }, { offset }) : searchObj;
      patientsData = await Patient.findAndCountAll(searchObj);
    }

    if (appointmentsCount) {
      const data = await Appointment.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isDeleted: false,
          isPending: false,
          patientId: {
            $not: null,
          },
        },
        group: ['patientId'],
        attributes: ['patientId', [sequelize.fn('COUNT', 'patientId'), 'PatientCount']],
        having: sequelize.literal(`count("patientId") ${appointmentsCount[0]} ${appointmentsCount[1]}`),
      });
      const patientIds = getIds(data, 'patientId');
      let searchObj = {
        raw: true,
        where: {
          accountId,
          id: patientIds,
        },
        include,
      };
      searchObj = keys.length === 1 ? Object.assign(searchObj, { limit }, { offset }) : searchObj;
      patientsData = await Patient.findAndCountAll(searchObj);
    }

    if (production) {
      const data = await Patient.findAll({
        where: {
          accountId,
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
      const patientIds = getIds(data, 'id');
      let searchObj = {
        raw: true,
        where: {
          accountId,
          id: patientIds,
        },
        include,
      };
      searchObj = keys.length === 1 ? Object.assign(searchObj, { limit }, { offset }) : searchObj;
      patientsData = await Patient.findAndCountAll(searchObj);
    }

    if (keys.length > 1) {
      const patients = patientsData.rows.map(d => d);
      const truncatedData = ManualLimitOffset(patients, limit, offset );
      return { rows: truncatedData, count: truncatedData.length };
    }

    return patientsData;

  } catch (err) {
    next(err);
  }
}

async function LateAppointmentsFilter(accountId, limit, offset, order, filters, smFilter, next) {
  try {
    const startMonthsOut = moment().subtract(smFilter.startMonth, 'months').toISOString();
    const endMonthsOut = moment().subtract(smFilter.endMonth, 'months').toISOString();

    const offSetLimit = {
    };

    if (!filters) {
      offSetLimit.offset = offset
      offSetLimit.limit = limit;
    }

    const patientsData = await Patient.findAndCountAll(Object.assign({
      raw: true,
      where: {
        accountId,
        nextApptId: null,
      },
      include: {
        model: Appointment,
        as: 'lastAppt',
        where: {
          startDate: {
            $between: [startMonthsOut, endMonthsOut],
          },
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],
      },
      offset,
      limit,
    }, offSetLimit));

    const patients = patientsData.rows.map(data => data);

    return {
      patients,
      count: patientsData.count,
    };
  } catch (err) {
    next(err);
  }
}

async function CancelledAppointmentsFilter(accountId, limit, offset, order, filters, smFilter, next) {
  try {
    const offSetLimit = {
    };

    if (!filters) {
      offSetLimit.offset = offset
      offSetLimit.limit = limit;
    }

    const patientsData = await Appointment.findAndCountAll(Object.assign({
      raw: true,
      nest: true,
      where: {
        accountId,
        isCancelled: true,
        isDeleted: false,
        startDate: {
          $between: [moment().subtract(48, 'hours').toISOString(), new Date()],
        },
        patientId: {
          $ne: null,
        },
      },
      include: {
        model: Patient,
        as: 'patient',
        required: true,
      },
    }, offSetLimit));

    const patients = patientsData.rows.map(data => data.patient);
    return {
      patients,
      count: patientsData.count,
    };
  } catch (err) {
    next(err);
  }
}

async function MissedPreAppointed(accountId, limit, offset, order, filters, smFilter, next) {
  try {
    const offSetLimit = {
    };

    if (!filters) {
      offSetLimit.offset = offset
      offSetLimit.limit = limit;
    }

    const patientsData = await Patient.findAndCountAll(Object.assign({
      raw: true,
      where: {
        accountId,
        nextApptId: null,
      },
      include: {
        model: Appointment,
        as: 'lastAppt',
        where: {
          startDate: {
            $between: [moment().subtract(30, 'days').toISOString(), new Date()],
          },
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],
      },
      offset,
      limit,
    }, offSetLimit));

    const patients = patientsData.rows.map(data => data);
    return {
      patients,
      count: patientsData.count,
    };

  } catch (err) {
    next(err);
  }
}

async function UnConfirmedPatientsFilter(accountId, limit, offset, order, filters, smFilter, next) {
  try {
    const offSetLimit = {
    };

    if (!filters) {
      offSetLimit.offset = offset;
      offSetLimit.limit = limit;
    }

    const patientsData = await Patient.findAndCountAll(Object.assign({
      raw: true,
      where: {
        accountId,
        nextApptId: {
          $not: null,
        },
      },
      include: [{
        model: Appointment,
        as: 'nextAppt',
        where: {
          startDate: {
            $between: [new Date(), moment().add(smFilter.days, 'days').toISOString()],
          },
          isPatientConfirmed: false,
        },
        attributes: ['startDate'],
        groupBy: ['startDate'],
        required: true,
      }, {
        model: Appointment,
        as: 'lastAppt',
        attributes: ['startDate'],
        groupBy: ['startDate'],
        required: false,
      }],
      offset,
      limit,
    }, offSetLimit));

    const patients = patientsData.rows.map(data => data);
    return {
      patients,
      count: patientsData.count,
    };
  } catch (err) {
    next(err);
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

/**
 * Fetching patients for patients table.
 *
 */
tableRouter.get('/', checkPermissions('table:read'), async (req, res, next) => {
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
    } = req.query;

    const filterBy = {
      accountId: req.accountId,
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

    if (smartFilter) {
      const smFilter = JSON.parse(smartFilter)
      filteredPatients = await smartFilterFunctions[smFilter.index](req.accountId, limit, offset, order, filters, smFilter, next);
    }

    if (filters && filters.length) {
      const runFilters = filters.map(async (filter) => {
        const filterObj = JSON.parse(filter);
        const patients = await filterFunctions[filterObj.type](filterObj.values, filteredPatients.patients, defaultQuery, req.accountId, next);
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

      patients = filteredPatients.patients;
    } else if (filters.length) {
      patients = filteredPatients;
    } else {
      patients = await PatientSearch(search, req.accountId, defaultQuery);

      patientCount = patients.length;
    }

    console.log(`--- ${Date.now() - start}ms elapsed patientFindAll`);

    /**
     * Calculating Revenue
     */
    const calcPatientRevenue = patients.map(async (patient) => {
      try {
        const productionRevenue = await mostBusinessSinglePatient(moment('1970-01-01').toISOString(), new Date(), req.accountId, patient.id)

        if (productionRevenue && productionRevenue.length) {
          patient.totalAmount = productionRevenue[0].totalAmount;
        }
        patient.totalPatients = patientCount;
        return patient;
      } catch (error) {
        next(error);
      }
    });

    Promise.all(calcPatientRevenue).then((data) => {
      console.log(`--- ${Date.now() - start}ms elapsed calcData`);
      const returnData = normalize('patients', data);
      return res.send(returnData);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = tableRouter;
