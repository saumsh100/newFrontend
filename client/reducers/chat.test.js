
import { fromJS } from 'immutable';
import reducer, {
  initialState,
  setUnreadChats,
  setChatMessages,
  setChatPoC,
  setLockedChats,
  setNewChat,
  setSelectedChat,
  setTotalChatMessages,
  updateChatId,
} from './chat';

const setUnreadChatsAction = setUnreadChats(['123', '456', '789']);
const setChatMessagesAction = setChatMessages([
  {
    id: '123',
    body: 'test',
  },
  {
    id: '321',
    body: 'test 1',
  },
]);
const setChatPoCActionNoPayload = setChatPoC();
const setChatPoCActionId = setChatPoC({ id: '333' });
const setLockedChatsAction = setLockedChats(['123']);
const setNewChatAction = setNewChat({ patientId: '333' });
const setSelectedChatAction = setSelectedChat(fromJS({
  id: '123',
  patientId: '333',
}));
const setTotalChatMessagesAction = setTotalChatMessages(13);
const updateChatIdAction = updateChatId();

describe('chat reducer', () => {
  test('action creator works', () => {
    expect(typeof setUnreadChats).toBe('function');
    expect(typeof setChatMessages).toBe('function');
    expect(typeof setChatPoC).toBe('function');
    expect(typeof setLockedChats).toBe('function');
    expect(typeof setNewChat).toBe('function');
    expect(typeof setSelectedChat).toBe('function');
    expect(typeof setTotalChatMessages).toBe('function');
    expect(typeof updateChatId).toBe('function');
  });

  test('setUnreadChats', () => {
    expect(setUnreadChatsAction).toMatchSnapshot();
  });

  test('setChatMessages', () => {
    expect(setChatMessagesAction).toMatchSnapshot();
  });

  test('setChatPoC no payload', () => {
    expect(setChatPoCActionNoPayload).toMatchSnapshot();
  });

  test('setChatPoC', () => {
    expect(setChatPoCActionId).toMatchSnapshot();
  });

  test('setLockedChats', () => {
    expect(setLockedChatsAction).toMatchSnapshot();
  });

  test('setNewChat', () => {
    expect(setNewChatAction).toMatchSnapshot();
  });

  test('setSelectedChat', () => {
    expect(setSelectedChatAction).toMatchSnapshot();
  });

  test('setTotalChatMessages', () => {
    expect(setTotalChatMessagesAction).toMatchSnapshot();
  });

  test('updateChatId', () => {
    expect(updateChatIdAction).toMatchSnapshot();
  });

  describe('reducers', () => {
    test('base', () => {
      expect(reducer(initialState, {})).toEqual(initialState);
    });

    test('setUnreadChats', () => {
      expect(reducer(initialState, setUnreadChatsAction)).toMatchSnapshot();
    });

    test('setChatMessages', () => {
      expect(reducer(initialState, setChatMessagesAction)).toMatchSnapshot();
    });

    test('setChatPoC no payload', () => {
      expect(reducer(initialState, setChatPoCActionNoPayload)).toMatchSnapshot();
    });

    test('setChatPoC with selected chat', () => {
      const stateWithSelectedChat = reducer(initialState, setSelectedChatAction);
      const PoCset = reducer(stateWithSelectedChat, setChatPoCActionId);
      expect(PoCset).toMatchSnapshot();
    });

    test('setChatPoC with newChat', () => {
      const newChatPocAction = setNewChat({ patientId: '333' });
      const stateWithNewChat = reducer(initialState, newChatPocAction);
      const PoCset = reducer(stateWithNewChat, setChatPoCActionId);
      expect(PoCset).toMatchSnapshot();
    });

    test('setNewChat', () => {
      expect(reducer(initialState, setNewChatAction)).toMatchSnapshot();
    });

    test('setLockedChats', () => {
      expect(reducer(initialState, setLockedChatsAction)).toMatchSnapshot();
    });

    test('setSelectedChat', () => {
      expect(reducer(initialState, setSelectedChatAction)).toMatchSnapshot();
    });

    test('setTotalChatMessages', () => {
      expect(reducer(initialState, setTotalChatMessagesAction)).toMatchSnapshot();
    });

    test('updateChatId', () => {
      expect(reducer(initialState, updateChatIdAction)).toMatchSnapshot();
    });

    test('updateChatId with selected chat', () => {
      const stateWithSelectedChat = reducer(initialState, setSelectedChatAction);
      const updatedChat = reducer(stateWithSelectedChat, updateChatIdAction);
      expect(updatedChat).toMatchSnapshot();
    });
  });
});
