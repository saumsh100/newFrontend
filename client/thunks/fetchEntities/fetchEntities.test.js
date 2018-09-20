
import thunkMiddleware from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchEntities from './fetchEntities';

const payload = { data: { entities: { weeklySchedules: { id: 'test' } } } };

jest.mock('axios', () => {
  const mockPayload = { data: { entities: { weeklySchedules: { id: 'test' } } } };
  return { get: () => new Promise(resolve => resolve(mockPayload)) };
});

describe('#fetchEntities', () => {
  const mockStore = configureMockStore([thunkMiddleware]);

  it('it dispatches the correct actions with the correct payload', async () => {
    const expectedActions = ['RECEIVE_ENTITIES'];

    // configure Mock store
    const store = mockStore({ entities: { get: () => ({ getUrlRoot: () => 'http://care.cru/api/accounts' }) } });
    const fetchParams = {
      key: 'accounts',
      join: ['weeklySchedule'],
      params: {},
    };

    // call the getBucketLists async action creator
    await store.dispatch(fetchEntities(fetchParams)).then(() => {
      const actions = store.getActions();
      expect(actions.map(v => v.type)).toEqual(expectedActions);
      expect(actions[0].payload).toEqual({
        key: fetchParams.key,
        ...payload.data,
      });
    });
  });
});
