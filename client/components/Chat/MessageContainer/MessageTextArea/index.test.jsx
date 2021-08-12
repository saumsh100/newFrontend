import React from 'react';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import MessageTextArea from '.';

const configureMockStore = configureStore();
let mockStore;

const getter = (data = {}) => ({
  get: (param) => data[param],
  ...data,
});

const initialProps = {
  chat: { id: 'test' },
  sendingMessage: false,
  selectChatOrCreate: () => {},
  onSendMessage: () => {},
};

const initialState = (isPoC = false) => ({
  form: getter({ [`chatMessageForm_${initialProps.chat.id}`]: { values: { message: 'test' } } }),
  chat: getter({
    isPoC,
    chatPoC: {
      firstName: 'PoC',
      lastName: 'CoP',
    },
  }),
  auth: getter(),
  entities: {
    patient: getter({
      firstName: 'Patient',
      mobilePhoneNumber: 'mobilePhoneNumber',
    }),
    getIn: () => getter(initialState(isPoC).entities.patient),
  },
});

const messageBuilder = (patient, poc) =>
  `Looks like ${patient.firstName}, ` +
  'is not the Point of Contact for their cell phone number. ' +
  `I think you are really trying to contact ${poc.firstName} ${poc.lastName} instead.`;

const App = ({ store, children }) => <Provider store={store}>{children}</Provider>;
describe('Point of Contact helper pop-up', () => {
  afterEach(cleanup);
  test('if the patient is not the PoC we should disable the send button and display the PoC helper', () => {
    const notPoC = initialState();
    mockStore = configureMockStore(notPoC);
    const renderWrapper = (
      <App store={mockStore}>
        <MessageTextArea {...initialProps} />
      </App>
    );
    const { container, getByTestId } = render(renderWrapper);

    expect(getByTestId('button_sendMessage')).toHaveClass('sendIconDisabled');
    const message = messageBuilder(notPoC.entities.patient, notPoC.chat.chatPoC);
    expect(container).toHaveTextContent(message);
  });

  test('if the patient is the PoC we should enable the send button and not display the PoC helper', () => {
    const isPoC = initialState(true);
    mockStore = configureMockStore(isPoC);
    const renderWrapper = (
      <App store={mockStore}>
        <MessageTextArea {...initialProps} />
      </App>
    );
    const { container, getByTestId } = render(renderWrapper);

    expect(getByTestId('button_sendMessage')).toHaveClass('sendIcon');
    const message = messageBuilder(isPoC.entities.patient, isPoC.chat.chatPoC);
    expect(container).not.toHaveTextContent(message);
  });
});

App.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.shape({}).isRequired,
};
