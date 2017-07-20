import moment from 'moment';

describe('Intelligence', () => {

  const today = moment();
  const endDate = moment(today).add(2, 'd').hour(0).minute(0).second(0).millisecond(0);

  
  beforeEach(() => {
    cy.login();
  });

  context('Overview', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('siteURL')}/intelligence/overview`);
    })

    it('load overview page, set the date-range, confirm calculated data', () => {
      cy
        .getAndClick('overViewDatePicker')
        .getAndClick('"startDate"')
        .get('.DayPicker-Day--today')
        .click()
        .fillTextInput('dates', 'endDate', `${endDate.toISOString()}`)
        .submitForm('dates')
        .get('[data-test-id="4_appointmentsConfirmed"]')
        .should('exist')
        .get('[data-test-id="Perry Cox hours booked"]')
        .contains('0h')
        .get('[data-test-id="Dr. Mansfield hours booked')
        .contains('1h');
    });
  });

  context('Business', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('siteURL')}/intelligence/business`);
    })

    it('load business page, set date range, and confirm calculated data ', () => {
      cy
        .getAndClick('businessDatePicker')
        .getAndClick('"startDate"')
        .get('.DayPicker-Day--today')
        .click()
        .fillTextInput('dates', 'endDate', `${endDate.toISOString()}`)
        .submitForm('dates')
        .get('[data-test-id="1_activePatients"]')
        .should('exist');
    });
  });
});
