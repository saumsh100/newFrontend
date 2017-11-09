
import moment from 'moment';
import { Appointment, Patient, DeliveredProcedure, Request, PatientUser, sequelize } from '../../_models';
import { LateAppointmentsFilter, CancelledAppointmentsFilter, UnConfirmedPatientsFilter, MissedPreAppointed } from './smartFilters';
import { DemographicsFilter } from './demographicsFilter';
import { FirstLastAppointmentFilter, AppointmentsCountFilter, ProductionFilter } from './appointmentsFilter';
import { mostBusinessSinglePatient } from '../intelligence/revenue';
import PatientSearch from './patientSearch';


function getIds(patients, key) {
  return patients.map((patient) => {
    return patient[key]
  });
}


async function AppointmentsFilter(values, filterIds, query, accountId, lastFilter) {
  try {

    if (production) {

    }

    if (onlineAppointments) {
      const data = await Request.findAll({
        raw: true,
        where: {
          accountId,
          isCancelled: false,
          isConfirmed: true,
        },
        include: {
          model: PatientUser,
          as: 'patientUser',
          required: true,
          duplicating: false,
          attributes: [],
          include: {
            model: Patient,
            as: 'patients',
            where: {
              id: patientIds,
            },
            required: true,
            duplicating: false,
            attributes: [],
          },
        },
        attributes: ['patientUser.id', [sequelize.fn('COUNT', 'patientUser.id'), 'PatientCount']],
        having: sequelize.literal('count("patientUser"."id") >= 1'),
        group: ['patientUser.id'],
      });

      const patientUserIds = getIds(data, 'id');

      patientsData = await Patient.findAndCountAll({
        raw: true,
        where: {
          accountId,
          patientUserId: patientUserIds,
        },
        include,
        limit,
        offset,
      });
    }
    console.log(patientsData)
    return patientsData;
  } catch (err) {
    console.log(err);
  }
}

const filterFunctions = [
  DemographicsFilter,
  FirstLastAppointmentFilter,
  AppointmentsCountFilter,
  ProductionFilter,
];

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
      const query = {
        offset,
        order,
      };
      console.log('length--->', filters.length)
      for (let i = 0; i < filters.length; i += 1) {
        const filterObj = JSON.parse(filters[i]);
        const index = filterObj.indexFunc;

        const patientIds = filteredPatients.rows ? getIds(filteredPatients.rows, 'id') : [];

        if (i === filters.length - 1) {
          query.limit = limit;
        }

        const patients = await filterFunctions[index](filterObj, patientIds, query, accountId);
        filteredPatients = patients;
      }
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
      patientCount = filteredPatients.count;

      patients = filteredPatients.rows;
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
