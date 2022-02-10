import { createAlert, removeAlert } from './alerts';

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
});
