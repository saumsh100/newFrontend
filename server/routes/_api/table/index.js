
import { Router } from 'express';
import moment from 'moment';
import { mostBusinessSinglePatient } from '../../../lib/intelligence/revenue';
import PatientSearch from '../../../lib/patientSearch';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, Patient, sequelize } from '../../../_models';

const tableRouter = new Router();

function SortByMomentDesc(a, b){
  if (moment(b).isBefore(moment(a))) return -1;
  if (moment(b).isAfter(moment(a))) return 1;
  return 0;
};

function SortByMomentAsc(a, b) {
  if (moment(b).isBefore(moment(a))) return 1;
  if (moment(b).isAfter(moment(a))) return -1;
  return 0;
};

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

function getNextLastAppointment (patientId, accountId) {
  return Appointment.findAll({
    raw: true,
    where: {
      accountId,
      patientId,
    },
    order: [['startDate', 'DESC']],
  }).then((appointments) => {
    const today = new Date();

    let nextAppt = null;
    let lastAppt = null;

    for (let i = 0; i < appointments.length; i++) {
      const app = appointments[i];
      const startDate = app.startDate;

      if (!nextAppt && moment(startDate).isAfter(today)) {
        nextAppt = startDate;
      } else if (moment(startDate).isAfter(today) && moment(startDate).isBefore(nextAppt)) {
        nextAppt = startDate;
        break;
      }
    }

    for (let i = 0; i < appointments.length; i++) {
      const app = appointments[i];
      const startDate = app.startDate;

      if (!lastAppt && moment(startDate).isBefore(moment())) {
        lastAppt = startDate;
      } else if (moment(startDate).isBefore(today) && moment(startDate).isAfter(lastAppt)) {
        lastAppt = startDate;
        break;
      }
    }
    return {
      nextAppt,
      lastAppt,
    };
  });
};

function getIds(patients) {
  return patients.map((patient) => {
    return patient.id;
  });
}

function DemographicsFilter(values, patients, query) {
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
  } = query

  const endDate = moment().subtract(ageStart, 'years').toISOString();
  const startDate = moment().subtract(ageEnd, 'years').toISOString();
  const idData = {};
  if (patients && patients.length) {
    const patientIds = getIds(patients);
    idData.id = patientIds;
  }

  const searchClause = {
    ...query.where,
    gender: {
      $ilike: gender,
    },
    address: {
      city: {
        $ilike: city,
      },
    },
    birthDate: {
      $between: [startDate, endDate],
    },
  };


  return Patient.findAll({
    raw: true,
    where: Object.assign({
      ...idData,
    }, searchClause),
    offset,
    limit,
    order,
  });
}

async function LateAppointmentsFilter(accountId, limit, offset, order, filters, smFilter, next) {
  try {
    console.log(smFilter)
    const startMonthsOut = moment().subtract(smFilter.startMonth, 'months').toISOString();
    const endMonthsOut = moment().subtract(smFilter.endMonth, 'months').toISOString();

    const appData = await Appointment.findAll({
      raw: true,
      attributes: ['patientId'],
      where: {
        accountId,
        startDate: {
          $between: [endMonthsOut, moment().add(1, 'year').toISOString()],
        },
        isCancelled: false,
        isDeleted: false,
        patientId: {
          $ne: null,
        },
      },
      groupBy: ['patientId'],
    });

    const patientIds = appData.map((data) => {
      return data.patientId;
    });

    //TODO sorting

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
        startDate: {
          $between: [startMonthsOut, endMonthsOut],
        },
        isCancelled: false,
        isDeleted: false,
        patientId: {
          $notIn: patientIds,
        },
      },
      //order: [[{ model: Patient, as: 'patient' }, 'firstName']],
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

    const appData = await Appointment.findAll({
      raw: true,
      nest: true,
      where: {
        accountId,
        startDate: {
          $between: [moment().subtract(30, 'days').toISOString(), new Date()],
        },
        isCancelled: false,
        isDeleted: false,
        patientId: {
          $ne: null,
        },
      },
      include: {
        model: Patient,
        as: 'patient',
        required: true,
      },
    });

    const patientIdsHash = {}
    const patientIds = appData.map((data) => {
      patientIdsHash[data.patient.id] = data.patient;
      return data.patient.id;
    });

    const patientsData = await Appointment.findAll({
      raw: true,
      attributes: ['patientId'],
      where: {
        accountId,
        isCancelled: false,
        isDeleted: false,
        startDate: {
          $between: [new Date(), moment().add(1, 'year').toISOString()],
        },
        patientId: {
          $in: patientIds,
        },
      },
      groupBy: ['patientId'],
    });

    patientsData.forEach(data => {
      if (patientIdsHash.hasOwnProperty(data.patientId)) {
        delete patientIdsHash[data.patientId];
      }
    });

    const hashKeys = Object.keys(patientIdsHash);
    const patients = hashKeys.map(id=> patientIdsHash[id]);

    const filteredPatients = ManualLimitOffset(patients, offSetLimit);

    return {
      patients: filteredPatients,
      count: patients.length,
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
      offSetLimit.offset = offset
      offSetLimit.limit = limit;
    }

    const patientsData = await Appointment.findAndCountAll(Object.assign({
      raw: true,
      nest: true,
      where: {
        accountId,
        isPatientConfirmed: false,
        isCancelled: false,
        isDeleted: false,
        startDate: {
          $between: [moment().toISOString(), moment().add(smFilter.days, 'days').toISOString()]
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

const filterFunctions = {
  Demographics: DemographicsFilter,
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
    let apptSortObj = null;

    if (sort && sort.length) {
      const sortObj = JSON.parse(sort[0]);

      if (sortObj.id === 'nextAppt' || sortObj.id === 'lastAppt') {
        apptSortObj = sortObj;
      } else {
        const descOrAsc = sortObj.desc ? 'DESC' : 'ASC';
        order.push([sortObj.id, descOrAsc]);
      }
    }

    const defaultQuery = {
      raw: true,
      where: filterBy,
      offset,
      limit,
      order,
    };


    /**
     * Applying Filters
     */
    let filteredPatients = [];

    if (smartFilter) {
      const smFilter = JSON.parse(smartFilter)
      filteredPatients = await smartFilterFunctions[smFilter.index](req.accountId, limit, offset, order, filters, smFilter, next);
    }

    if (filters && filters.length) {
      const runFilters = filters.map(async (filter) => {
        const filterObj = JSON.parse(filter);
        const patients = await filterFunctions[filterObj.type](filterObj.values, filteredPatients.patients, defaultQuery);
        return patients;
      });
      const data = await Promise.all(runFilters);
      filteredPatients = data[0];
    }

    /**
     * Searching patients and displaying filters
     */
    let patients = null;
    let patientCount = 0;

    if (!search && !smartFilter) {
      patientCount = await Patient.count({
        where: filterBy,
        order,
      });
      patients = await Patient.findAll({
        ...defaultQuery,
      });
    } else if (smartFilter && !filters) {
      console.log('smart filtering!!')
      patientCount = filteredPatients.count;
      patients = filteredPatients.patients;
    } else if (filters.length) {
      console.log('normal filtering!!')
      patients = filteredPatients;
      patientCount = filteredPatients.length;
    } else {
      patients = await PatientSearch(search, req.accountId, defaultQuery);
      patientCount = patients.length;
    }

    console.log(`--- ${Date.now() - start}ms elapsed patientFindAll`);

    /**
     * Calculating Next Appointment, Last Appointment, and Revenue
     */
    const calcPatientData = patients.map(async (patient) => {
      try {
        const appData = await getNextLastAppointment(patient.id, req.accountId, next);

        if (appData.nextAppt) {
          patient.nextAppt = appData.nextAppt;
        }

        if (appData.lastAppt) {
          patient.lastAppt = appData.lastAppt;
        }

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


    /**
     * Sorting for next/last appointment
     */
    Promise.all(calcPatientData).then((data) => {
      console.log(`--- ${Date.now() - start}ms elapsed calcData`);

      let sortedData = data;
      if (apptSortObj) {
        sortedData = data.sort((a, b) => {
          return (apptSortObj.desc ? SortByMomentDesc(a[apptSortObj.id], b[apptSortObj.id]) :
            SortByMomentAsc(a[apptSortObj.id], b[apptSortObj.id]));
        });
      }

      const returnData = normalize('patients', sortedData);
      return res.send(returnData);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = tableRouter;
