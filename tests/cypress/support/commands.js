Cypress.addParentCommand('spoofTextMessage', (message) => {
  let data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  xhr.open("POST", "http://a4855a4c.ngrok.io/twilio/sms/accounts/2aeab035-b72c-4f7a-ad73-09465cbf5654");
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("accept", "*/*");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("postman-token", "7bfbb8a2-960a-0a0f-128c-1910f8c1a2d3");

  xhr.send(data);
});

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
  })

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
    });
});
