
import thunkMiddleware from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import deleteEntityRequest from './deleteEntityRequest';

jest.mock('axios', () => {
  const mockPayload = { data: { entities: { weeklySchedules: { id: 'test' } } } };
  return {
    delete: (r = '/resolve') =>
      new Promise((resolve, reject) => (r === '/resolve' ? resolve(mockPayload) : reject(mockPayload))),
  };
});

describe('#deleteEntityRequest', () => {
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
    jest.spyOn(console, 'log');
    console.error.mockImplementation(() => {});
    console.log.mockImplementation(() => {});
  });

  afterEach(() => {
    store.clearActions(); // clear redux actions
    console.error.mockRestore();
    console.log.mockRestore();
  });

  it('it dispatches the correct actions with the correct payload', async () => {
    const expectedActions = ['DELETE_ENTITY', 'CREATE_ALERT'];
    await store.dispatch(deleteEntityRequest(fetchParams));
    const actions = store.getActions();
    expect(actions.map(v => v.type)).toEqual(expectedActions);
    expect(actions[0].payload).toEqual({
      key: fetchParams.key,
      id: fetchParams.id,
    });
  });

  it('it dispatches the correct actions when failing', async () => {
    const expectedActions = ['CREATE_ALERT'];

    try {
      await store.dispatch(deleteEntityRequest({
        ...fetchParams,
        url: '/reject',
        alert: undefined,
      }));
    } catch (err) {
      console.error(err);
    }

    const actions = store.getActions();
    expect(actions.map(v => v.type)).toEqual(expectedActions);
    expect(actions[0].payload).toEqual({
      alert: { body: 'Delete account failed' },
      type: 'error',
    });
  });
});
