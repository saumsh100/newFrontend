
import moment from 'moment';
import { Patient } from '../../_models';
import { LateAppointmentsFilter, CancelledAppointmentsFilter, UnConfirmedPatientsFilter, MissedPreAppointed } from './smartFilters';
import { DemographicsFilter } from './demographicsFilter';
import { FirstLastAppointmentFilter, AppointmentsCountFilter, ProductionFilter, OnlineAppointmentsFilter } from './appointmentsFilter';
import { PractitionersFilter } from './practitionersFilter';
import { RemindersFilter, LastReminderFilter } from './remindersFilter';
import { RecallsFilter, LastRecallFilter } from './recallsFilter';
import { ReviewsFilter } from './reviewsFilter';
import { mostBusinessSinglePatient } from '../intelligence/revenue';
import { getIds } from './helpers';

const filterFunctions = [
  DemographicsFilter,
  DemographicsFilter,
  DemographicsFilter,
  FirstLastAppointmentFilter,
  FirstLastAppointmentFilter,
  AppointmentsCountFilter,
  ProductionFilter,
  OnlineAppointmentsFilter,
  PractitionersFilter,
  RemindersFilter,
  RemindersFilter,
  RemindersFilter,
  RecallsFilter,
  RecallsFilter,
  RecallsFilter,
  LastReminderFilter,
  LastRecallFilter,
  ReviewsFilter,
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
      const offSetLimit = {};

      if (!filters) {
        offSetLimit.offset = offset;
        offSetLimit.limit = limit;
        offSetLimit.order = order;
      }

      filteredPatients = await smartFilterFunctions[smFilter.index](accountId, offSetLimit, smFilter);
    }

    if (filters && filters.length) {
      const query = {};

      const sortArray = filters.sort((a, b) => {
        const filter1 = JSON.parse(a);
        const filter2 = JSON.parse(b);

        if (filter1.intensive && !filter2.intensive) return 1;
        if (!filter1.intensive && filter2.intensive) return -1;
        return 0;
      });

      for (let i = 0; i < sortArray.length; i += 1) {
        const filterObj = JSON.parse(sortArray[i]);
        const index = filterObj.indexFunc;

        console.log('Running filter-->', filterObj.tag);

        const patientIds = filteredPatients.rows ? getIds(filteredPatients.rows, 'id') : [];

        if (i === filters.length - 1) {
          query.order = order;
          query.offset = offset;
          query.limit = limit;
        }

        const patients = await filterFunctions[index](filterObj, patientIds, query, accountId);

        if (patients.rows.length === 0) {
          filteredPatients = patients;
          break;
        }

        filteredPatients = patients;
      }
    }

    /**
     * Searching patients and displaying filtered patients
     */
    let patients = null;

    if (!smartFilter && !(filters && filters.length)) {
      patientCount = await Patient.count({
        where: filterBy,
        order,
      });

      patients = await Patient.findAll({
        ...defaultQuery,
      });
    } else {
      patientCount = filteredPatients.count;
      patients = filteredPatients.rows;
    }

    console.log(`--- ${Date.now() - start}ms elapsed patientFindAll`);

    /**
     * Calculating Revenue
     */
    const ids = getIds(patients, 'id');

    patients = await mostBusinessSinglePatient(moment().subtract(1, 'years').toISOString(), new Date(), accountId, ids, order);

    const patientData = [{ totalPatients: patientCount, data: patients }];

    return patientData;
  } catch (error) {
    throw error;
  }
}
