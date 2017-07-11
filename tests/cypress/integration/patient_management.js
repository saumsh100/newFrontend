/**
 * Created by gavinservai on 2017-06-28.
 */

describe('Patient Management', () => {

  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds');
  });

  beforeEach(() => {
    cy.login();
  });

  context('Messages', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('siteURL')}/patients/messages`);
    });

    // As a clinic user I want to...

    it('send a message in a chat, and receive a reply', () => {
      cy
        .server()
        .route({
          method: 'POST',
          url: '/api/chats/textMessages',
          response: 'fixture:responses/chat/firstMessageSent.json',
        })
        .get('[data-test-id="patientSearch"]')
        .type('Sergey')
        .getAndClick('"Sergey SkovorodnikovSuggestion"')
        .fillTextInput('chatMessageForm', 'message', 'Sent message #1 of E2E test')
        .submitForm('chatMessageForm')
        .get('[data-test-id="chatMessage"]')
        .contains('Sent message #1 of E2E test')
        .should('exist')
        .parent()
        .next()
        .contains('Response to message #1 of E2E test')
        .should('exist');
    });
  });

  context('Patients', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('siteURL')}/patients/list`);
    });

    it('select a patient and see its data on the page', () => {
      cy
        .get('[data-test-id="patientListSearch"]')
        .type('justin')
        .getAndClick('"Justin SharpSuggestion"')
        .get('[data-test-id=editFirstName]')
        .should('have.value', 'Justin');
    });

    it('edit a selected patients basic info', () => {
      cy
        .get('[data-test-id="patientListSearch"]')
        .type('justin')
        .getAndClick('"Justin SharpSuggestion"')
        .fillTextInput('editPatient', 'lastName', 'Sharpe')
        .submitForm('editPatient')
        .getAndClick('contactTab')
        .fillTextInput('contactPatient', 'city', 'Bangkok')
        .submitForm('contactPatient')
        .reload()
        .get('[data-test-id="patientListSearch"]')
        .type('justin')
        .getAndClick('"Justin SharpeSuggestion"')
        .getAndClick('contactTab')
        .get('[data-test-id=city]')
        .should('have.value', 'Bangkok');
    });
  });
});
