
context('Practitioners settings - schedule', () => {
  context('Practitioners schedule local TZ', () => {
    beforeEach(() => {
      cy.login('/settings/practitioners')
        .wait(1000);
    });

    it('set time for office hours', () => {
      cy
        .get('[data-test-id="tab_practitionerOfficeHours"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="toggle_setCustom"]')
        .then((toggle) => {
          if (toggle.val() !== 'on') {
            toggle.click();
          }
        })
        .wait(1000)
        .selectOption('officeHoursForm', 'dropDown_monday_startTime', 'option_96')
        .selectOption('officeHoursForm', 'dropDown_monday_endTime', 'option_192')
        .submitForm('officeHoursForm');
    });

    it('set the thurdsay\'s break hours', () => {
      cy
        .get('[data-test-id="tab_practitionerOfficeHours"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="button_thursday_addBreak"]')
        .click({ force: true })
        .selectOption('breaksForm', 'input_thursdayBreakStartTime', 'option_180')
        .selectOption('breaksForm', 'input_thursdayBreakEndTime', 'option_183')
        .submitForm('breaksForm');
    });
  });

  context('Time Off local TZ', () => {
    beforeEach(() => {
      cy.login('/settings/practitioners');
    });

    it('creates new time off record in local tz', () => {
      cy
        .get('[data-test-id="tab_practitionerTimeOff"]')
        .click({ force: true })
        .get('[data-test-id="addTimeOffButton"]')
        .click({ force: true })
        .get('[data-test-id="toggle_allDay"]')
        .find('input[type=checkbox]')
        .click({ force: true })
        .get('[data-test-id="startDate"]')
        .clear({ force: true })
        .type('1')
        .get('[data-test-id="endDate"]')
        .clear({ force: true })
        .type('5')
        .selectOption('addTimeOffForm', 'startTime', 'option_14')
        .selectOption('addTimeOffForm', 'endTime', 'option_15')
        .get('[data-test-id="addTimeOffDialogSave"]')
        .click({ force: true });
    });
  });

  context('Recurring time off local TZ', () => {
    beforeEach(() => {
      cy.login('/settings/practitioners');
    });

    it('creates a new recurring time off record in local tz', () => {
      cy
        .get('[data-test-id="tab_practitionerRecurringTimeOff"]')
        .click({ force: true })
        .get('[data-test-id="addRecurringTimeOffButton"]')
        .click({ force: true })
        .selectOption('addRecurringTimeOffForm', 'dropdown_interval', 'option_0')
        .selectOption('addRecurringTimeOffForm', 'dropdown_dayOfWeek', 'option_1')
        .get('[data-test-id="toggle_allDay"]')
        .find('input[type=checkbox]')
        .click({ force: true })
        .selectOption('addRecurringTimeOffForm', 'startTime', 'option_0')
        .selectOption('addRecurringTimeOffForm', 'endTime', 'option_2')
        .submitForm('addRecurringTimeOffForm');
    });
  });

  context('Different TZ', () => {
    beforeEach(() => {
      cy.login();
      cy.visit(`${Cypress.env('siteURL')}/settings/practitioners`, {
        onBeforeLoad(pageWindow) {
          cy.stub(pageWindow.Date.prototype, 'getTimezoneOffset').returns(180);
        },
      }).wait(1000);
    });

    it('persist timing for office hours', () => {
      cy
        .get('[data-test-id="tab_practitionerOfficeHours"]')
        .click({ force: true })
        .get('[data-test-id="dropDown_monday_startTime"]')
        .contains('8:00 AM')
        .get('[data-test-id="dropDown_monday_endTime"]')
        .contains('4:00 PM')
        .get('[data-test-id="input_thursdayBreakStartTime"]')
        .contains('3:00 PM')
        .get('[data-test-id="input_thursdayBreakEndTime"]')
        .contains('3:15 PM');
    });

    it('persist timing for time off', () => {
      cy
        .get('[data-test-id="tab_practitionerTimeOff"]')
        .click({ force: true })
        .get('[data-test-id="timeOffList"]')
        .contains('Jan 1st 2001 2:00 PM To: May 1st 2001 3:00 PM');
    });

    it('persist timing for recurring time off', () => {
      cy
        .get('[data-test-id="tab_practitionerRecurringTimeOff"]')
        .click({ force: true })
        .get('[data-test-id="timeOffList"]')
        .contains('12:00 AM To: 2:00 AM');
    });
  });
});
