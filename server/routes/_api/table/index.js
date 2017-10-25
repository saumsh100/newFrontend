
import { Router } from 'express';
import moment from 'moment';
import { mostBusinessSinglePatient } from '../../../lib/intelligence/revenue';
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
      filter,
      sort,
      page,
    } = req.query;

    const filterBy = {
      accountId: req.accountId,
    };

    if (filter && filter.length) {
      const firstFilter = JSON.parse(filter[0]);
      const id = firstFilter.id;
      const value = firstFilter.value;

      filterBy[id] = {
        $iRegexp: value,
      };
    }

    const orderBy = [];

    let apptSortObj = null;

    if (sort && sort.length) {
      const sortObj = JSON.parse(sort[0]);
      if (sortObj.id === 'nextAppt' || sortObj.id === 'lastAppt') {
        apptSortObj = sortObj;
      } else {
        const descOrAsc = sortObj.desc ? 'DESC' : 'ASC';
        orderBy.push([sortObj.id, descOrAsc]);
      }
    }

    const patientCount = await Patient.count({
      where: filterBy,
      order: orderBy,
    });

    const patients = await Patient.findAll({
      raw: true,
      where: filterBy,
      offset: limit * page,
      limit,
      order: orderBy,
    });
    console.log(`--- ${Date.now() - start}ms elapsed patientFindAll`);

    // Getting nextAppt, lastAppt, etc.
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
