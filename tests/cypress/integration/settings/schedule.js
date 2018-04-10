
context('Account Settings - Schedule', () => {
  beforeEach(() => {
    cy.login();
  });

  context('Chairs', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/schedule/chairs');
    });

    it('update active chairs', () => {
      cy
        .get('[data-test-id="chair_1"]')
        .find('input')
        .click({ force: true })
        .reload()
        .get('[data-test-id="chair_1"]')
        .find('input')
        .should('have.value', 'on');
    });
  });

  context('Office Hours', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/schedule/hours');
    });

    // As a user I want to...

    it('toggle on/off a day of the week', () => {
      cy
        .getAndClick('toggle_monday')
        .getAndClick('dropDown_monday_startTime')
        .get('[data-test-id="option_0"]')
        .should('exist');
    });

    it('update my schedule start time', () => {
      cy
        .getAndClick('toggle_monday')
        .getAndClick('dropDown_monday_startTime')
        .submitForm('officeHoursForm')
        .reload()
        .get('[data-test-id="toggle_monday"]')
        .find('input')
        .should('have.value', 'on');
    });

    it('add a break and save it', () => {
      cy
        .getAndClick('button_monday_addBreak')
        .submitForm('breaksForm')
        .reload()
        .get('[data-test-id="input_mondayBreakStartTime"]')
        .should('exist');
    });

    it('delete a saved break', () => {
      cy
        .getAndClick('button_mondayBreakTrash')
        .submitForm('breaksForm')
        .reload()
        .get('[data-test-id="input_mondayBreakStartTime"]')
        .should('not.exist');
    });

    it('add a schedule pattern', () => {
      cy
        .getAndClick('button_changeStartDate')
        .getAndClick('input_startDateDayPicker')
        .get('.DayPicker-Day--today')
        .click()
        .submitForm('advanceCreate')
        .get('[data-test-id="button_createPatternSchedule"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="pattern_0"]')
        .should('exist');
    });
  });

  context('Online Booking', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/schedule/onlinebooking');
    });

    it('select a new widget color', () => {
      cy
        .getAndClick('colorInput')
        .get('.chrome-picker')
        .get('.saturation-black')
        .invoke('show')
        .click({ force: true })
        .submitForm('selectAccountColorForm');
    });

    it('set interval option', () => {
      cy
        .selectOption('intervalPreferenceForm', 'timeInterval', 'option_0')
        .submitForm('intervalPreferenceForm')
        .reload()
        .get('[data-test-id=timeInterval]')
        .contains('15');
    });
  });
});

