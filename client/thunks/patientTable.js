
import axios from 'axios';
import each from 'lodash/each';
import { setTableData, setIsLoading } from '../reducers/patientTable';

// disabling to keep thunks consistent with named exports
// eslint-disable-next-line import/prefer-default-export
export const fetchPatientTableData = () => async (dispatch, getState) => {
  try {
    dispatch(setIsLoading(true));
    const { patientTable } = getState();

    const filters = patientTable.get('filters').toArray();
    const query = patientTable.toJS();

    query.filters = filters;
    delete query.data;
    delete query.totalPatients;
    delete query.isLoadingTable;
    delete query.filterTags;
    delete query.timelineFilters;

    const patientData = await axios.get('/api/table', { params: query });
    const dataArray = getEntities(patientData.data.entities);

    const totalPatients = dataArray[dataArray.length - 1].count;
    const patients = dataArray.slice(0, -1);

    dispatch(setTableData({ totalPatients, data: patients, isLoadingTable: false }));
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
