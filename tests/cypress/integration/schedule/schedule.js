describe.skip('Schedule Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:5100/schedule');
  });

  it('add an appointment to the schedule', () => {
    cy.getAndClick('button_appointmentQuickAdd')
      .get('[data-test-id="createAppointmentForm"]')
      .find('[data-test-id="chairId"]')
      .click({ force: true })
      .next()
      .get('[data-test-id="option_0"]')
      .click({ force: true })
      .get('[data-test-id="createAppointmentForm"]')
      .find('[data-test-id="practitionerId"]')
      .click({ force: true })
      .next()
      .get('[data-test-id="option_0"]')
      .click({ force: true })
      .get('[data-test-id="createAppointmentForm"]')
      .find('[data-test-id="patientSelected"]')
      .type('Testy Testerson')
      .parent()
      .next()
      .contains('Testy Testerson')
      .click()
      .submitForm('createAppointmentForm')
      .reload()
      .get('[data-test-id="appointment_TestyTesterson"]')
      .should('exist');
  });

  it('update an appointment', () => {
    cy.get('[data-test-id="appointment_TestyTesterson"]')
      .click()
      .get('[data-test-id="button_editAppointment"]')
      .click()
      .get('[data-test-id="createAppointmentForm"]')
      .find('[data-test-id="chairId"]')
      .click({ force: true })
      .next()
      .get('[data-test-id="option_1"]')
      .click({ force: true })
      .submitForm('createAppointmentForm');
  });

  it('add patient to waitlist', () => {
    cy.getAndClick('button_headerWaitlist')
      .getAndClick('button_addToWaitlist')
      .get('[data-test-id="Add to Waitlist Form"]')
      .find('[data-test-id="patientData"]')
      .type('Testy Testerson')
      .parent()
      .next()
      .contains('Testy Testerson')
      .click()
      .get('[data-test-id="Add to Waitlist Form"]')
      .getAndClick('monday')
      .get('[data-test-id="button_submitForm"]')
      .click()
      .get('[data-test-id="list_waitListItem"]')
      .should('have.length', 1);
  });

  it('load appointments from the previous day', () => {
    cy.getAndClick('button_previousDay')
      .get('[data-test-id="appointment_TestyTesterson"]')
      .should('exist');
  });
});
