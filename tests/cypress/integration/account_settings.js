/**
 * Created by gavinservai on 2017-06-19.
 */


describe('Account Settings', () => {

  before(() => {
    cy.exec('npm run seeds');
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
          .get('[data-test-id=addUserButton]')
          .click()
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
          .get('[data-test-id=inviteUserButton]')
          .click()
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
          .get('')
      });

    });
  });
});
