/**
 * Created by gavinservai on 2017-06-19.
 */


describe('Account Settings', () => {

  before(() => {
    cy.exec('NODE_ENV="test" npm run seeds');
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
          .fillEmailInput('newUserDialog', 'email', 'johnsmith@carecru.com')
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
          .fillEmailInput('inviteUserDialog', 'email', 'gavin+invitetest@carecru.com')
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
        .get('[data-test-id="name"')
        .should('have.value', 'Child Dental Test Update');
    });

    it('disable a practioner', () => {
      cy
        .getAndClick('Chelsea Manfield')
        .submitForm('servicePractitionersForm')
        .reload()
        .get('[data-test-id="Chelsea Manfield"]')
        .find()
    });
  });
});
