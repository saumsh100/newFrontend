
import reducer, {
  initialState,
  backToSet,
  nextSet,
  bookngSet,
  accountSet,
  reviewSet,
  hasSelectedDateSet,
  isEditingSet,
  selectAvailableActions,
} from './index';

describe('featureFlags reducer', () => {
  const backToSetAction = backToSet('/my-page');
  const nextSetAction = nextSet('/my-page');
  const bookngSetAction = bookngSet('/my-page');
  const accountSetAction = accountSet('/my-page');
  const reviewSetAction = reviewSet('/my-page');
  const hasSelectedDateSetAction = hasSelectedDateSet(true);
  const isEditingSetAction = isEditingSet(true);

  test('action creator works', () => {
    expect(backToSetAction).toMatchSnapshot();
    expect(nextSetAction).toMatchSnapshot();
    expect(bookngSetAction).toMatchSnapshot();
    expect(accountSetAction).toMatchSnapshot();
    expect(reviewSetAction).toMatchSnapshot();
    expect(hasSelectedDateSetAction).toMatchSnapshot();
    expect(isEditingSetAction).toMatchSnapshot();
  });

  test('selectors works', () => {
    expect(selectAvailableActions(initialState, 'reason')).toEqual([]);
    expect(selectAvailableActions(initialState, 'review')).toEqual(['next']);
    expect(selectAvailableActions({ isEditing: true }, 'review')).toEqual(['cancel', 'confirm']);
  });

  test('reducer works', () => {
    expect(reducer(initialState, {})).toEqual(initialState);
    expect(reducer(initialState, backToSetAction)).toMatchSnapshot();
    expect(reducer(initialState, nextSetAction)).toMatchSnapshot();
    expect(reducer(initialState, bookngSetAction)).toMatchSnapshot();
    expect(reducer(initialState, accountSetAction)).toMatchSnapshot();
    expect(reducer(initialState, reviewSetAction)).toMatchSnapshot();
    expect(reducer(initialState, hasSelectedDateSetAction)).toMatchSnapshot();
    expect(reducer(initialState, isEditingSetAction)).toMatchSnapshot();
  });
});
