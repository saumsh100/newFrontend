import moment from 'moment';

describe('Intelligence', () => {

  const today = moment();
  const nextDay = moment(today).add(2, 'days');

  before(() => {
    cy
      .exec('env NODE_ENV="test" npm run seeds')
      .login()
      .visit('http://localhost:5100/intelligence/overview');
  });

  it('loadpage and set the date-range and show confirmed appointments', () => {
    cy
      .getAndClick('overViewDatePicker')
      .getAndClick('"startDate"')
      .get('.DayPicker-Day--today')
      .click()
      .fillTextInput('dates', 'endDate', `${nextDay.toISOString()}`)
      .submitForm('dates')
      .get('[data-test-id="4_appointmentsConfirmed"]')
      .should('exist');
  });
});
