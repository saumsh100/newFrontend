/**
 * Created by gavinservai on 2017-06-19.
 */


describe('Account Settings', () => {

  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds');
  });

  beforeEach(() => {
    cy.login();
  });

  context('Clinic Settings', () => {
    context('General Settings', () => {
      beforeEach(() => {
        cy.visit('http://localhost:5100/settings/clinic/general');
      });

      // As a user I want to...

      it('update my basic settings', () => {
        cy
          .fillTextInput('generalSettingsForm', 'name', 'Donna Dental Test')
          .fillTextInput('generalSettingsForm', 'twilioPhoneNumber', '9876543212')
          .fillTextInput('generalSettingsForm', 'destinationPhoneNumber', '1234567898')
          .fillTextInput('generalSettingsForm', 'vendastaId', '99988')
          .fillInput('generalSettingsForm', 'contactEmail', 'test@test.com')
          .submitForm('generalSettingsForm')
          .reload()
          .get('[data-test-id=name]')
          .should('have.value', 'Donna Dental Test');
      });

      it('update my address info', () => {
        cy
          .selectOption('addressSettingsForm', 'country', 'Canada')
          .fillTextInput('addressSettingsForm', 'street', '88829 98th Ave')
          .fillTextInput('addressSettingsForm', 'city', 'Vancouver')
          .fillTextInput('addressSettingsForm', 'zipCode', 'V6P1E8')
          .selectOption('addressSettingsForm', 'state', 'BC')
          .submitForm('addressSettingsForm')
          .reload()
          .get('[data-test-id=street]')
          .should('have.value', '88829 98th Ave');
      });
    });

    context('Users Settings', () => {
      beforeEach(() => {
        cy.visit('http://localhost:5100/settings/clinic/users');
      });

      // As a user I want to...

      it('add another user to my practice', () => {
        cy
          .getAndClick('addUserButton')
          .fillTextInput('newUserDialog', 'firstName', 'John')
          .fillTextInput('newUserDialog', 'lastName', 'Smith')
          .fillInput('newUserDialog', 'email', 'johnsmith@carecru.com')
          .selectOption('newUserDialog', 'role', 'ADMIN')
          .fillTextInput('newUserDialog', 'password', 'testaccntpass')
          .fillTextInput('newUserDialog', 'confirmPassword', 'testaccntpass')
          .submitDialogForm('newUserDialog')
          .reload()
          .get('[data-test-id="John Smith"]')
          .should('exist');

      });

      it('invite another user to my practice', () => {
        cy
          .getAndClick('inviteUserButton')
          .fillInput('inviteUserDialog', 'email', 'gavin+invitetest@carecru.com')
          .submitDialogForm('inviteUserDialog')
          .reload()
          .get('[data-test-id="gavin+invitetest@carecru.com"]')
          .should('exist');
      });
    });
  });

  context('Schedule Settings', () => {
    context('Office Hours', () => {
      beforeEach(() => {
        cy.visit('http://localhost:5100/settings/schedule/hours');
      });

      // As a user I want to...

      it('click a button to toggle on/off a day of the week', () => {
        cy
          .getAndClick('mondayToggle')
          .getAndClick('mondayStartTime')
          .get('[data-test-id="1970-01-31T08:00:00.000Z"]')
          .should('exist');
      });

      it('save a change to my schedule', () => {
        cy
          .getAndClick('mondayToggle')
          .getAndClick('mondayStartTime')
          .submitForm('officeHoursForm')
          .reload()
          .get('[data-test-id="mondayToggle"]')
          .find('input')
          .should('have.value', 'on');
      });

      it('add a break and save it', () => {
        cy
          .getAndClick('mondayAddBreakButton')
          .submitForm('breaksForm')
          .reload()
          .get('[data-test-id="mondayBreakStartTime"]')
          .should('exist');
      });

      it('delete a saved break', () => {
        cy
          .getAndClick('mondayBreakTrash')
          .submitForm('breaksForm')
          .reload()
          .get('[data-test-id="mondayBreakStartTime"]')
          .should('not.exist');
      });

      it('add a schedule pattern', () => {
        cy
          .getAndClick('changeStartDate')
          .getAndClick('startDateDayPicker')
          .get('.DayPicker-Day--today')
          .click()
          .submitForm('advanceCreate')
          .get('[data-test-id="createPatternSchedule"]')
          .click({ force: true })
          .get('[data-test-id="patternHeader0"]')
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
          .find('[value="#F29B12"]')
          .clear()
          .type('#123AF2')
          .submitForm('selectAccountColorForm')
          .reload()
          .get('[data-test-id="colorInput"]')
          .should('have.value', '#123af2');
      });
    });

    context('Reminders Settings', () => {
      beforeEach(() => {
        cy.visit('http://localhost:5100/settings/schedule/reminderslist');
      });

      it('toggling the state of reminders', () => {
        cy
          .get('[data-test-id="toggleSendReminders"]')
          .click({ force: true })
          .reload();
      });

      it('create new reminder', () => {
        cy
          .getAndClick('createNewReminder')
          .fillInput('newReminder', 'lengthHours', '30')
          .selectOption('newReminder', 'primaryType', 'sms')
          .submitForm('newReminder');
      });
    })

    context('Recalls Settings', () => {
      beforeEach(() => {
        cy.visit('http://localhost:5100/settings/schedule/recalls');
      });

      it('toggling the state of recalls', () => {
        cy
          .get('[data-test-id="toggleSendRecalls"]')
          .click({ force: true });
      });

      it('create new recall', () => {
        cy
          .getAndClick('createNewRecall')
          .fillInput('newRecall', 'lengthMonths', '3')
          .selectOption('newRecall', 'primaryType', 'email')
          .submitForm('newRecall');
      });
    })
  });

  context('Services Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/services');
    });

    it('modify the name of an existing service', () => {
      cy
        .fillTextInput('serviceDataForm', 'name', 'Child Dental Test Update')
        .submitForm('serviceDataForm')
        .reload()
        .get('[data-test-id="serviceDataForm"]')
        .find('[data-test-id="name"]')
        .should('have.value', 'Child Dental Test Update');
    });

    it('update the enable/disable state of practitioner', () => {
      cy
        .get('[data-test-id=ChelseaMansfield]')
        .find('input')
        .click({ force: true })
        .submitForm('servicePractitionersForm')
        .reload()
        .get('[data-test-id=ChelseaMansfield]')
        .find('.react-toggle--checked')
        .should('not.exist');
    });

    it('create a new service', () => {
      cy
        .getAndClick('addServiceButton')
        .fillTextInput('createServiceForm', 'name', 'TestService')
        .fillInput('createServiceForm', 'duration', '3')
        .fillInput('createServiceForm', 'bufferTime', '3')
        .submitForm('createServiceForm')
        .reload()
        .get('[data-test-id="TestService"]')
        .should('exist');
    });
  });

  context('Practitioner Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/practitioners');
    });

    it('update the name of a practitioner', () => {
      cy
        .fillTextInput('practitionerBasicDataForm', 'firstName', 'Kelsey')
        .submitForm('practitionerBasicDataForm')
        .reload()
        .get('[data-test-id="practitionerBasicDataForm"]')
        .find('[data-test-id="firstName"]')
        .should('have.value', 'Kelsey');
    });

    it('update enable/disable state of a service', () => {
      cy
        .getAndClick('practitionerServicesTab')
        .get('[data-test-id=ToothacheToggle]')
        .find('input')
        .click({ force: true })
        .submitForm('practitionerServicesForm')
        .visit('http://localhost:5100/settings/services')
        .getAndClick('Toothache')
        .get('[data-test-id=KelseyMansfield]')
        .find('.react-toggle--checked')
        .should('not.exist');
    });

    it('add time off for a practitioner', () => {
      cy
        .getAndClick('practitionerTimeOffTab')
        .getAndClick('addTimeOffButton')
        .getAndClick('moreOptionsButton')
        .fillTextInput('addTimeOffForm', 'noteInput', 'This is a test note.')
        .submitDialogForm('addTimeOffDialog')
        .reload()
        .getAndClick('practitionerTimeOffTab')
        .get('[data-test-id="timeOffList"]')
        .should('exist');
    });

    it('add a new practitioner', () => {
      cy
        .getAndClick('addPractitionerButton')
        .fillTextInput('createPractitionerForm', 'firstName', 'Testly')
        .fillTextInput('createPractitionerForm', 'lastName', 'Testerson')
        .submitForm('createPractitionerForm')
        .reload()
        .get('[data-test-id="TestlyTesterson"]')
        .should('exist');
    });

    it('delete a practitioner', () => {
      cy
        .getAndClick('KelseyMansfield')
        .getAndClick('deletePractitioner')
        .reload()
        .get('[data-test-id="KelseyMansfield"]')
        .should('not.exist');
    });

    it('set practitioner to inactive', () => {
      cy
        .getAndClick('PerryCoxActive')
        .submitForm('practitionerBasicDataForm')
        .visit('http://localhost:5100/schedule')
        .getAndClick('quickAddAppointment')
        .getAndClick('practitionerId')
        .contains('Perry Cox')
        .should('not.exist');
    });
  });
});
