
import reducer, {
  createInitialEntitiesState,
  fetchEntities,
  receiveEntities,
  deleteEntity,
  deleteAllEntity,
  updateEntity,
} from './entities';

const initialState = createInitialEntitiesState();

const fetchEntitiesAction = fetchEntities('accounts');
const receiveEntitiesAction = receiveEntities({
  entities: {
    accounts: {
      123: {
        id: '123',
        name: 'test',
      },
    },
  },
});
const deleteEntityAction = deleteEntity({
  key: 'accounts',
  id: '123',
});
const deleteAllEntityAction = deleteAllEntity('accounts');
const updateEntityAction = updateEntity({
  key: 'accounts',
  entity: {
    entities: {
      accounts: {
        123: {
          id: 123,
          name: 'changed name',
        },
      },
    },
  },
});

describe('entities reducer', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1));
  });

  test('actions works', () => {
    expect(typeof fetchEntities).toBe('function');
    expect(typeof receiveEntities).toBe('function');
    expect(typeof deleteEntity).toBe('function');
    expect(typeof deleteAllEntity).toBe('function');
    expect(typeof updateEntity).toBe('function');
  });

  test('fetch entitits', () => {
    expect(fetchEntitiesAction).toMatchSnapshot();
  });

  test('receive entitits', () => {
    expect(receiveEntitiesAction).toMatchSnapshot();
  });

  test('delete entitity', () => {
    expect(deleteEntityAction).toMatchSnapshot();
  });

  test('delete all entitits', () => {
    expect(deleteAllEntityAction).toMatchSnapshot();
  });

  test('update entitity', () => {
    expect(updateEntityAction).toMatchSnapshot();
  });

  describe('reducers', () => {
    test('base', () => {
      expect(reducer(initialState, {})).toEqual(initialState);
    });

    test('fetchEntities', () => {
      expect(reducer(initialState, fetchEntitiesAction)).toMatchSnapshot();
    });

    test('receiveEntities', () => {
      expect(reducer(initialState, receiveEntitiesAction)).toMatchSnapshot();
    });

    test('deleteEntity', () => {
      const state = reducer(initialState, receiveEntitiesAction);
      expect(reducer(state, deleteEntityAction)).toMatchSnapshot();
    });

    test('deleteAllEntity', () => {
      const state = reducer(initialState, receiveEntitiesAction);
      expect(reducer(state, deleteAllEntityAction)).toMatchSnapshot();
    });

    test('updateEntity', () => {
      const state = reducer(initialState, receiveEntitiesAction);
      expect(reducer(state, updateEntityAction)).toMatchSnapshot();
    });
  });
});
