

describe('Account Settings - Practice', () => {
  beforeEach(() => {
    cy.login();
  });

  context('General Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/practice/general');
    });

    it('update clinic details', () => {
      cy
        .fillTextInput('clinicDetailsForm', 'name', 'Donna Dental Test')
        .fillTextInput('clinicDetailsForm', 'website', 'www.testclinic.com')
        .fillTextInput('clinicDetailsForm', 'phoneNumber', '5555555555')
        .fillTextInput('clinicDetailsForm', 'contactEmail', 'testclinic@gmail.com')
        .submitForm('clinicDetailsForm')
        .reload()
        .get('[data-test-id=name]')
        .should('have.value', 'Donna Dental Test')
        .get('[data-test-id=contactEmail]')
        .should('have.value', 'testclinic@gmail.com');
    });

    it.skip('update address details', () => {
      cy
        .fillTextInput('addressSettingsForm', 'street', '88829 98th Ave')
        .selectOption('addressSettingsForm', 'country', 'option_0')
        .fillTextInput('addressSettingsForm', 'city', 'Vancouver')
        .selectOption('addressSettingsForm', 'state', 'option_0')
        .fillTextInput('addressSettingsForm', 'zipCode', 'V6P1E8')
        .selectOption('addressSettingsForm', 'timezone', 'option_0')
        .submitForm('addressSettingsForm')
        .reload()
        .get('[data-test-id=street]')
        .should('have.value', '88829 98th Ave');
    });
  });

  context('General Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/practice/superadmin');
    });

    it('update administrative info', () => {
      cy
        .getAndClick('toggle_canSendReminders')
        .fillTextInput('superAdminSettingsForm', 'destinationPhoneNumber', '5555555555')
        .fillTextInput('superAdminSettingsForm', 'vendastaId', 'Liberty Chiropractic')
        .fillTextInput('superAdminSettingsForm', 'unit', 10)
        .fillTextInput('superAdminSettingsForm', 'facebookUrl', 'www.facebook.com')
        .fillTextInput('superAdminSettingsForm', 'googlePlaceId', '123google')
        .submitForm('superAdminSettingsForm')
        .reload()
        .get('[data-test-id="toggle_canSendReminders"]')
        .find('input')
        .should('have.value', 'on')
        .get('[data-test-id="unit"]')
        .should('have.value', '10');
    });
  });

  context('General Settings', () => {
    after(() => {
      // RESET THE TIMEZONE
      cy
        .visit('http://localhost:5100/settings/practice/general')
        .wait(1000)
        .selectOption('addressSettingsForm', 'timezone', 'option_160')
        .submitForm('addressSettingsForm');
    });

    it('change timezones of office hours when timezone is altered', () => {
      cy
        .visit('http://localhost:5100/settings/practice/hours')
        .wait(1000)
        .get('[data-test-id="dropDown_monday_startTime"]')
        .contains('9:00 AM')
        .visit('http://localhost:5100/settings/practice/general')
        .wait(1000)
        .selectOption('addressSettingsForm', 'timezone', 'option_114')
        .submitForm('addressSettingsForm')
        .visit('http://localhost:5100/settings/practice/hours')
        .wait(1000)
        .get('[data-test-id="dropDown_monday_startTime"]')
        .contains('12:00 PM');
    });
  });

  context.skip('Users Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/practice/users');
    });

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
