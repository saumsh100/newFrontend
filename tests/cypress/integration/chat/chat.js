
describe('Chat Tests', () => {
  beforeEach(() => {
    cy.login();
  });

  beforeEach(() => {
    cy
      .visit(`${Cypress.env('siteURL')}/chat`);
  });

  it('initiate a new conversation with a patiemt', () => {
    cy
      .getAndClick('dropDown_accounts')
      .get('[data-test-id="option_Liberty Chiropractic"]')
      .click({ force: true })
      .wait(1000)
      .get('[data-test-id="button_addNewChat"]')
      .click({ force: true })
      .get('[data-test-id="input_chatSearch"]')
      .find('input')
      .type('Testy')
      .parent()
      .next()
      .contains('Testy Testerson')
      .click()
      .get('[data-test-id="chatMessageForm"]')
      .get('[data-test-id="message"]')
      .click({ force: true })
      .type('Hello')
      .get('[data-test-id="chatMessageForm"]')
      .get('[data-test-id="button_sendMessage"]')
      .click({ force: true })
      .get('[data-test-id="item_chatMessage"]')
      .should('exist');
  });

  it.skip('send a message from the patient', () => {
    cy
      .getAndClick('dropDown_accounts')
      .get('[data-test-id="account_1"]')
      .click({ force: true })
      .wait(1000)
      .sendTextMessage(
        'a021cf88-1b5c-4d54-a0f4-b6629523b738',
        'd088f259-a3b1-4057-9453-9de92423cba6',
        '906-594-6264',
        '72954241-3652-4792-bae5-5bfed53d37b7',
      );
  });
});
