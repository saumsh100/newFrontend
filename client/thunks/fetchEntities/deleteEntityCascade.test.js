
import thunkMiddleware from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import deleteEntityCascade from './deleteEntityCascade';

jest.mock('axios', () => {
  const mockPayload = { data: { entities: { weeklySchedules: { id: 'test' } } } };
  return {
    delete: (r = '/resolve') =>
      new Promise((resolve, reject) => (r === '/resolve' ? resolve(mockPayload) : reject(mockPayload))),
  };
});

describe('#deleteEntityCascade', () => {
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
    const expectedActions = ['DELETE_ENTITY'];
    await store.dispatch(deleteEntityCascade(fetchParams));
    const actions = store.getActions();
    expect(actions.map(v => v.type)).toEqual(expectedActions);
    expect(actions[0].payload).toEqual({
      key: fetchParams.key,
      id: fetchParams.id,
    });
  });

  it('it dispatches the correct actions with the correct payload with cascadeKey', async () => {
    const expectedActions = ['DELETE_ENTITY', 'DELETE_ENTITY', 'DELETE_ENTITY'];
    const expectedPayload = [
      {
        id: 'id1',
        key: 'cascadeKey',
      },
      {
        id: 'id2',
        key: 'cascadeKey',
      },
      {
        id: 'test',
        key: 'accounts',
      },
    ];

    await store.dispatch(deleteEntityCascade({
      ...fetchParams,
      cascadeKey: 'cascadeKey',
      ids: ['id1', 'id2'],
    }));

    const actions = store.getActions();
    expect(actions.map(v => v.type)).toEqual(expectedActions);
    expect(actions.map(v => v.payload)).toEqual(expectedPayload);
  });

  it('it dispatches the correct actions when failing', async () => {
    try {
      await store.dispatch(deleteEntityCascade({
        ...fetchParams,
        url: '/reject',
        alert: undefined,
      }));
    } catch (err) {
      console.error(err);
    }

    expect(console.log).toHaveBeenCalled();
  });
});
