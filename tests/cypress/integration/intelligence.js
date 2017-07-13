import moment from 'moment';

describe('Intelligence', () => {

  const today = moment();
  const nextDay = moment(today).add(2, 'd').hour(12).minute(0).second(0).millisecond(0);


  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds');
  });

  beforeEach(() => {
    cy.login();
  });

  context('Overview', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/intelligence/overview');
    })

    it('load overview page and set the date-range and show confirmed appointments', () => {
      cy
        .getAndClick('overViewDatePicker')
        .getAndClick('"startDate"')
        .get('.DayPicker-Day--today')
        .click()
        .fillTextInput('dates', 'endDate', `${nextDay.toISOString()}`)
        .submitForm('dates')
        .get('[data-test-id="4_appointmentsConfirmed"]')
        .should('exist')
        .get('[data-test-id="Perry Cox hours booked"]')
        .contains('0h')
        .get('[data-test-id="Perry Cox hours not filled')
        .contains('9h')
        .get('[data-test-id="Dr. Mansfield hours booked')
        .contains('1h')
        .get('[data-test-id="Dr. Mansfield hours not filled')
        .contains('8h');
    });
  });

  context('Business', () => {
    beforeEach(()=> {
      cy.visit('http://localhost:5100/intelligence/business')

    })
    it('load business page', () => {
      cy
        .getAndClick('businessDatePicker')
        .getAndClick('"startDate"')
        .get('.DayPicker-Day--today')
        .click()
        .fillTextInput('dates', 'endDate', `${nextDay.toISOString()}`)
        .submitForm('dates')
    });
  });
});
