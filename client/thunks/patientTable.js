
import each from 'lodash/each';
import { push } from 'connected-react-router';
import { reset } from 'redux-form';
import { addFilter, setTableData, setIsLoading, removeAllFilters } from '../reducers/patientTable';
import { httpClient } from '../util/httpClient';

// disabling to keep thunks consistent with named exports
// eslint-disable-next-line import/prefer-default-export
export const fetchPatientTableData = () => async (dispatch, getState) => {
  const { patientTable, auth } = getState();
  if (!patientTable.get('isLoadingTable')) {
    try {
      dispatch(setIsLoading(true));
      const params = {
        ...patientTable.get('filters').toJS(),
        isHoH: true,
        authUserId: auth.get('userId'),
      };
      const {
        data: { entities },
      } = await httpClient().get('/api/table/search', { params });
      const dataArray = getEntities(entities);

      const TOTAL_PATIENTS_KEY = 'totalPatients';
      const { count } = dataArray.find(({ id }) => id === TOTAL_PATIENTS_KEY);
      const patients = dataArray.filter(({ id }) => id !== TOTAL_PATIENTS_KEY);

      dispatch(
        setTableData({
          count,
          data: patients,
        }),
      );

      dispatch(setIsLoading(false));
    } catch (err) {
      throw err;
    }
  }
};

const patientTableFilterForms = [
  'demographics',
  'appointments',
  'practitioners',
  'communication',
  'reminders',
  'recalls',
  'followUps',
];

/**
 * jumpToMyFollowUps will clear all existing Patient Management filters/forms
 * and direct users to the "My Follow-ups (past 30 days)" list with that list's
 * data fetched
 *
 * @returns {Function}
 */
export const jumpToMyFollowUps = () => (dispatch) => {
  dispatch(removeAllFilters());
  patientTableFilterForms.map(form => dispatch(reset(form)));
  dispatch(
    addFilter({
      page: 0,
      segment: ['myFollowUps', 30, true],
      order: [['patientFollowUps.dueAt', 'asc']],
    }),
  );
  dispatch(fetchPatientTableData());
  dispatch(push('/patients/list'));
};

function getEntities(entities) {
  const data = [];
  each(entities, (collectionMap) => {
    each(collectionMap, (modelData) => {
      data.push(modelData);
    });
  });
  return data;
}
