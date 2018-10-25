
context('Practice settings - office hours', () => {
  context('Office hours local TZ', () => {
    beforeEach(() => {
      cy.login('/settings/practice/hours');
    });

    it('set time for office hours', () => {
      cy
        .selectOption('officeHoursForm', 'dropDown_monday_startTime', 'option_108')
        .selectOption('officeHoursForm', 'dropDown_monday_endTime', 'option_204')
        .submitForm('officeHoursForm');
    });

    it('set the mondays break hours', () => {
      cy
        .get('[data-test-id="button_wednesday_addBreak"]')
        .click({ force: true })
        .selectOption('breaksForm', 'input_wednesdayBreakStartTime', 'option_180')
        .selectOption('breaksForm', 'input_wednesdayBreakEndTime', 'option_183')
        .submitForm('breaksForm');
    });
  });

  context('Office hours different TZ', () => {
    beforeEach(() => {
      cy.login();
      cy.visit(`${Cypress.env('siteURL')}/settings/practice/hours`, {
        onBeforeLoad(pageWindow) {
          cy.stub(pageWindow.Date.prototype, 'getTimezoneOffset').returns(180);
        },
      });
    });

    it('persist the same time value for office hours', () => {
      cy
        .get('[data-test-id="dropDown_monday_startTime"]')
        .contains('9:00 AM')
        .get('[data-test-id="dropDown_monday_endTime"]')
        .contains('5:00 PM')
        .get('[data-test-id="input_wednesdayBreakStartTime"]')
        .contains('3:00 PM')
        .get('[data-test-id="input_wednesdayBreakEndTime"]')
        .contains('3:15 PM');
    });
  });
});
