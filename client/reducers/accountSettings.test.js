
import reducer, { initialState, setServiceId, setPractitionerId } from './accountSettings';

const setServiceIdAction = setServiceId({ id: '123123123' });
const setPractitionerIdAction = setPractitionerId({ id: '33333' });

describe('accountSettings reducer', () => {
  test('action creator works', () => {
    expect(typeof setServiceId).toBe('function');
    expect(typeof setPractitionerId).toBe('function');
  });

  test('setServiceId', () => {
    expect(setServiceIdAction).toMatchSnapshot();
  });

  test('setPractitionerId', () => {
    expect(setPractitionerIdAction).toMatchSnapshot();
  });

  test('reducer work', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
    expect(reducer(initialState, setServiceIdAction)).toMatchSnapshot();
    expect(reducer(initialState, setPractitionerIdAction)).toMatchSnapshot();
  });
});
