const uuid = require('uuid');

Cypress.Commands.add('submitDialogForm', (dataTestId) => {
  cy
    .get(`[data-test-id=${dataTestId}Save]`)
    .click();
});

Cypress.Commands.add('submitForm', (dataTestId) => {
  cy
    .get(`[data-test-id=${dataTestId}]`)
    .submit();
});

Cypress.Commands.add('getAndClick', (dataTestId) => {
  cy
    .get(`[data-test-id=${dataTestId}]`)
    .click();
});

Cypress.Commands.add('selectOption', (formDataTestId, dataTestId, optionValue) => {
  console.log(optionValue)
  cy
    .get(`[data-test-id=${formDataTestId}]`)
    .find(`[data-test-id=${dataTestId}]`)
    .click({ force: true })
    .next()
    .get(`[data-test-id=${optionValue}]`)
    .click({ force: true });
});

Cypress.Commands.add('fillTextInput', (formDataTestId ,dataTestId, text) => {
  cy
    .get(`[data-test-id=${formDataTestId}]`)
    .find(`[data-test-id=${dataTestId}]`)
    .clear()
    .type(text);
});

Cypress.Commands.add('fillInput', (formDataTestId ,dataTestId, email) => {
  cy
    .get(`[data-test-id=${formDataTestId}]`)
    .find(`[data-test-id=${dataTestId}]`)
    .type(email);
});

Cypress.Commands.add('login', (username, secret) => {
  const email = username || 'justin@carecru.com';
  const password = secret || 'justin';
  const log = Cypress.log({
    name: 'login',
    message: [email, password],
    consoleProps() {
      return { email, password };
    },
  });

  return cy.request({
      method: "POST",
      url: `${Cypress.env('siteURL')}/auth`,
      body: { username: email, password },
    }).then((resp) => {
      return window.localStorage.setItem('token', resp.body.token);
    }).visit(`${Cypress.env('siteURL')}`)

  /*
  cy
    .visit(`${Cypress.env('siteURL')}/login`, { log: false })
    .get('input[name=email]', { log: false })
    .type(email, { log: false })
    .get('input[name=password]', { log: false })
    .type(password, { log: false })
    .get('button', { log: false })
    .click({ log: false })
    .get('button[role=SUPERADMIN]', { log: false })
    .then(() => {
      log.snapshot().end();
    });*/
});

Cypress.Commands.add('sendTextMessage', (patientId, chatId, mobilePhoneNumber, accountId) => {
  return cy.request({
    method: 'POST',
    url: '/api/chats/textMessages', // baseUrl is prepended to url
    header: {
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: {
      message: 'test',
      patient: {
        id: patientId,
        mobilePhoneNumber,
        accountId,
      },
      userId: '83fd6b53-83b1-425a-9c6b-ec120c0e91ae',
      chatId: 'd088f259-a3b1-4057-9453-9de92423cba6',
    },
  });
});

Cypress.Commands.add('receiveTextMessage', (accountId, From, To, Body) => {
  return cy.request({
    method: 'POST',
    url: `/twilio/sms/accounts/${accountId}`,
    header: {
      'Content-Type': 'application/json',
    },
    body: {
      From,
      To,
      Body,
      MessageSid: uuid(),
    },
  });
});
