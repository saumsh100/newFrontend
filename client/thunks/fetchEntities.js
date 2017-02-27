
import _ from 'lodash';
import axios from './axios';
import {
  receiveEntities,
  deleteEntity,
  addEntity,
  updateEntity,
  sendMessageOnClientAction,
  readMessagesInCurrentDialogAction,
} from '../actions/entities';

export function fetchEntities({ key, join, params = {}, domen }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);

    // Add onto the query param for join if passed in
    if (join && join.length) {
      params.join = join.join(',');
    }

    const url = domen ? `/${key}` : entity.getUrlRoot();
    axios.get(url, { params })
      .then((response) => {
        const { data } = response;
        dispatch(receiveEntities({ key, entities: data.entities }));
      })
      .catch((err) => {
        // TODO: set didInvalidate=true of entity and dispatch alert action
        console.log(err);
      });
  };
}

export function deleteEntityRequest({ key, id }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    axios.delete(`${entity.getUrlRoot()}/${id}`)
      .then(() => {
        dispatch(deleteEntity({ key, id }));
      })
      .catch(err => console.log(err));
  };
}

export function createEntityRequest({ key, entityData }) {
  return (dispatch, getState) => {
    const { entities } = getState();
    const entity = entities.get(key);
    return axios.post(entity.getUrlRoot(), entityData)
      .then((response) => {
        const { data } = response;
        dispatch(addEntity({ key, entity: data.entities }));
      })
      .catch(err => console.log(err));
  };
}

export function updateEntityRequest({ key, model }) {
  return (dispatch) => {
    axios.put(model.getUrlRoot(), model.toJSON())
      .then((response) => {
        const { data } = response;
        dispatch(updateEntity({ key, entity: data.entities }));
      })
      .catch(err => console.log(err));
  };
}

export function sendMessageOnClient(message) {
  return function (dispatch, getState) {
    dispatch(sendMessageOnClientAction({ message }));
  };
}

export function readMessagesInCurrentDialog(dialogId, readMessageId = null) {
  return function(dispatch, getState) {
    const { entities } = getState();
    const entity = entities.get('dialogs');
    const currentDialog = getState().entities.get('dialogs').toJS().models[dialogId];
    const messages = currentDialog.messages
      .sort((m1,m2) => moment(m1.createdAt) > moment(m2.createdAt));

    //user readMessageId is not null - we will update only that messages as read
    const messageToUpdate = messages.filter(m => m.id === readMessageId )[0];
    const i = _.findIndex(messages, m => m.id == readMessageId);
      if (messageToUpdate && i > -1) {
        const changedMessageToUpdate = Object.assign(_.omit(messageToUpdate, 'index'), { read: true });
        axios.put(`/api/textMessages/${messageToUpdate}`, changedMessageToUpdate)
          .then((response) => {
            const messageId = response.data.result;
            // make it read: true on the client
            dispatch(readMessagesInCurrentDialogAction({ messageId, dialogId, messageIndex: i }));
          });
        return;
      }

    // otherwise
    // we need to get the last 5 messages and check if thay are read: fasle
    // if dialog contains less then 5 - get all messages
    let messagesLength = messages.length;
    let startIndex = messages.length-5;
    if (messagesLength < 5) startIndex = 0;
    const endIndex = messages.length;
    // get last N messages and remember their indexes.
    // filter only read: false
    const lastFiveMessages =  messages.slice(startIndex, endIndex)
      .map((m, index) => Object.assign(m, { index: index + startIndex }));
    const readMessages = lastFiveMessages.filter(m => !m.read);
    readMessages.forEach(m => {
      // make it read: true on the server
      const messageToSave = Object.assign(_.omit(m, 'index'), { read: true });
      axios.put(`/api/textMessages/${m.id}`, messageToSave)
        .then((response) => {
          const messageId = response.data.result;
          // make it read: true on the client
          dispatch(readMessagesInCurrentDialogAction({ messageId, dialogId, messageIndex: m.index }));
        });
    });

  }
}

