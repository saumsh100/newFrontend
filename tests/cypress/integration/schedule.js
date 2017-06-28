/**
 * Created by gavinservai on 2017-06-26.
 */


describe('Schedule', () => {

  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds');
  });

  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:5100/schedule');
  });
  // As a clinic user I want to...

  it('view my appointments for TODAY when I load the Schedule page', () => {
    cy
      .get('.loadedContent')
      .find('[data-test-id="timeSlotAlexBashliy"]')
      .should('exist');
  });

  it('select my day, and view appointments for that day', () => {
    cy
      .get('.loadedContent')
      .getAndClick('dayPicker')
      .get('.DayPicker-Day')
      .contains('1')
      .click()
      .get('.loadedContent')
      .get('[data-test-id="timeSlotJustinSharp"]')
      .should('exist');
  });

  it('create and subsequently view an appointment for TODAY', () => {
    cy
      .getAndClick('quickAddAppointment')
      .getAndClick('date')
      .get('.DayPicker-Day--today')
      .click()
      .selectOption('createAppointmentForm', 'time', '"1970-01-31T14:30:00.000Z"')
      .getAndClick('practitionerId')
      .contains('Perry Cox')
      .parent()
      .click()
      .getAndClick('serviceId')
      .contains('Regular Consultation')
      .parent()
      .click()
      .getAndClick('chairId')
      .contains('Chair 1')
      .parent()
      .click({ force: true })
      .get('[data-test-id="patientSelected"]')
      .find('input')
      .click()
      .type('Alex')
      .parent()
      .next()
      .contains('Alex')
      .click()
      .submitForm('createAppointmentForm')
      .reload()
      .get('.loadedContent')
      .find('[data-test-id="timeSlotAlexBashliy"]')
      .should('exist');
  });
});
