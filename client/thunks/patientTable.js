
import each from 'lodash/each';
import { setTableData, setIsLoading } from '../reducers/patientTable';
import { httpClient } from '../util/httpClient';

// disabling to keep thunks consistent with named exports
// eslint-disable-next-line import/prefer-default-export
export const fetchPatientTableData = () => async (dispatch, getState) => {
  try {
    dispatch(setIsLoading(true));
    const { patientTable } = getState();
    const params = {
      ...patientTable.get('filters').toJS(),
      isHoH: true,
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
