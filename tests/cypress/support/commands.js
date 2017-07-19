Cypress.addParentCommand('submitDialogForm', (dataTestId) => {
  cy
    .get(`[data-test-id=${dataTestId}Save]`)
    .click();
});

Cypress.addParentCommand('submitForm', (dataTestId) => {
  cy
    .get(`[data-test-id=${dataTestId}]`)
    .submit();
});

Cypress.addParentCommand('getAndClick', (dataTestId) => {
  cy
    .get(`[data-test-id=${dataTestId}]`)
    .click();
});

Cypress.addParentCommand('selectOption', (formDataTestId, dataTestId, optionValue) => {
  cy
    .get(`[data-test-id=${formDataTestId}]`)
    .find(`[data-test-id=${dataTestId}]`)
    .click({ force: true })
    .next()
    .get(`[data-test-id=${optionValue}]`)
    .click({ force: true });
});

Cypress.addParentCommand('fillTextInput', (formDataTestId ,dataTestId, text) => {
  cy
    .get(`[data-test-id=${formDataTestId}]`)
    .find(`[data-test-id=${dataTestId}]`)
    .clear()
    .type(text);
});

Cypress.addParentCommand('fillInput', (formDataTestId ,dataTestId, email) => {
  cy
    .get(`[data-test-id=${formDataTestId}]`)
    .find(`[data-test-id=${dataTestId}]`)
    .type(email);
});

Cypress.addParentCommand('login', (username, secret) => {
  const email = username || 'justin@carecru.com'
  const password = secret || 'justin'

  const log = Cypress.Log.command({
    name: 'login',
    message: [email, password],
    consoleProps() {
      return { email, password };
    },
  });

  return cy.request({
      method: "POST",
      url: `${Cypress.env('siteURL')}/auth`,
      body: { username: email, password }
    }).then((resp) => {
      cy.visit(`${Cypress.env('siteURL')}`, {
        onBeforeLoad: function(win) {
          win.localStorage.setItem('token', resp.body.token)
        },
      });
    });

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
