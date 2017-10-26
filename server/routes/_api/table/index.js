
import { Router } from 'express';
import moment from 'moment';
import { mostBusinessSinglePatient } from '../../../lib/intelligence/revenue';
import PatientSearch from '../../../lib/patientSearch';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { Appointment, Patient } from '../../../_models';

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
  const patientIds = getIds(patients)
  let idData = {};
  if (patientIds) {
    idData.id = patientIds;
  }
console.log(idData)

  return Patient.findAll({
    raw: true,
    where: {
      id: patientIds,
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
    },
    offset,
    limit,
    order,
  });
}

function LateAppointments(accountId) {
  const endDate = moment().subtract(6, 'months').toISOString();
  const startDate = moment().subtract(9, 'months').toISOString();

  return Appointment.findAll({
    raw: true,
    nest: true,
    where: {
      accountId,
      startDate: {
        $between: [startDate, endDate],
      },
    },
    include: {
      model: Patient,
      as: 'patient',
    },
  }).then((appointments) => {
    const patients = []
    const runFilter = appointments.map(async (app) => {
      const nextLast = await getNextLastAppointment(app.patient.id, accountId);
      console.log(nextLast)
      if (!nextLast.nextAppt) {
        if (nextLast.lastAppt && moment(nextLast.lastAppt).isBefore(endDate)) {
          patients.push(app.patient);
        }
      }
    });

    return Promise.all(runFilter).then(() => {
      return patients;
    });
  });
}

const filterFunctions = {
  Demographics: DemographicsFilter,
};

const smartFilterFunctions = [LateAppointments];
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
    const patientSortBy = [];
    let apptSortObj = null;

    if (sort && sort.length) {
      const sortObj = JSON.parse(sort[0]);

      if (sortObj.id === 'nextAppt' || sortObj.id === 'lastAppt') {
        apptSortObj = sortObj;
      } else {
        const descOrAsc = sortObj.desc ? 'DESC' : 'ASC';
        patientSortBy.push([sortObj.id, descOrAsc]);
      }
    }

    const defaultQuery = {
      raw: true,
      where: filterBy,
      offset: limit * page,
      limit,
      order: patientSortBy,
    };

    let filteredPatients = [];

    if (smartFilter) {
      filteredPatients = await smartFilterFunctions[smartFilter](req.accountId);
    }

    if (filters && filters.length) {

      const runFilters = filters.map(async (filter) => {
        const filterObj = JSON.parse(filter);
        const patients = await filterFunctions[filterObj.type](filterObj.values, filteredPatients, defaultQuery);
        return patients;
      });
      const data = await Promise.all(runFilters);
      filteredPatients = data[0]
    }

    /*
    /**
     * Searching patients
     */
    let patients = null;
    let patientCount = 0;

    if (!search) {
      patientCount = await Patient.count({
        where: filterBy,
        order: patientSortBy,
      });
      patients = await Patient.findAll({
        ...defaultQuery,
      });
    }
    if (filteredPatients.length) {
      console.log('woooooooxs')
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
