
import omit from 'lodash/omit';
import reducer, { initialState, createAlert, removeAlert } from './alerts';

const createAlertAction = createAlert({
  alert: {
    id: '123-456',
    title: 'test alert',
    body: 'test body',
  },
  type: 'failed',
});

const removeAlertAction = removeAlert({ alert: { id: '123-456' } });

describe('alerts reducer', () => {
  test('action creator works', () => {
    expect(typeof createAlert).toBe('function');
    expect(typeof removeAlert).toBe('function');
  });

  test('createAlert', () => {
    expect(createAlertAction).toMatchSnapshot();
  });

  test('removeAlert', () => {
    expect(removeAlertAction).toMatchSnapshot();
  });

  test('reducer works', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
    const omitedCreate = omit(reducer(initialState, createAlertAction), ['"123-456".lastUpdated']);
    expect(omitedCreate.deleteIn(['123-456', 'lastUpdated'])).toMatchSnapshot();
    expect(reducer(initialState, removeAlertAction)).toMatchSnapshot();
  });
});
