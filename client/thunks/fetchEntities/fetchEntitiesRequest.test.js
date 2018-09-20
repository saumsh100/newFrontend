
import thunkMiddleware from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchEntitiesRequest from './fetchEntitiesRequest';

jest.mock('axios', () => {
  const mockPayload = { data: { entities: { weeklySchedules: { id: 'test' } } } };
  return {
    get: (r = '/resolve') =>
      new Promise((resolve, reject) => (r === '/resolve' ? resolve(mockPayload) : reject(mockPayload))),
  };
});

describe('#fetchEntitiesRequest', () => {
  const mockStore = configureMockStore([thunkMiddleware]);
  // configure Mock store
  const model = {
    getUrlRoot: () => '/model',
    toJSON: () => {
      'test';
    },
  };

  const store = mockStore({ entities: { get: () => model } });
  const alert = {
    success: 'success',
    error: 'error',
  };
  const fetchParams = {
    id: 'test',
    key: 'accounts',
    model,
    values: {},
    url: '/resolve',
    alert,
    merge: {},
  };

  beforeEach(() => {
    // stub console logging for assertion
    jest.spyOn(console, 'error');
    console.error.mockImplementation(() => {});
  });

  afterEach(() => {
    store.clearActions(); // clear redux actions
    console.error.mockRestore();
  });

  it('it dispatches the correct actions with the correct payload', async () => {
    const expectedActions = [
      '@apiRequests/CREATE_REQUEST',
      '@apiRequests/RECEIVE_REQUEST',
      'RECEIVE_ENTITIES',
    ];

    await store.dispatch(fetchEntitiesRequest(fetchParams));
    const actions = store.getActions();
    expect(actions.map(v => v.type)).toEqual(expectedActions);
    expect(actions[0].payload).toEqual({ id: fetchParams.id });
  });

  it('it dispatches the correct actions when failing', async () => {
    const expectedActions = ['@apiRequests/CREATE_REQUEST'];
    try {
      await store.dispatch(fetchEntitiesRequest({
        ...fetchParams,
        url: '/reject',
      }));
    } catch (err) {
      console.error(err);
    }

    const actions = store.getActions();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(actions.map(v => v.type)).toEqual(expectedActions);
    expect(actions[0].payload).toEqual({ id: fetchParams.id });
  });
});
