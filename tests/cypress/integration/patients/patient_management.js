
describe('Patient Management Table Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.visit(`${Cypress.env('siteURL')}/patients/list`);
  });

  it('create and search for new patient', () => {
    cy
      .getAndClick('button_addNewPatient')
      .fillTextInput('newPatientForm', 'firstName', 'Cypress')
      .fillTextInput('newPatientForm', 'lastName', 'Hill')
      .selectOption('newPatientForm', 'gender', 'option_0')
      .fillTextInput('newPatientForm', 'mobilePhoneNumber', '+12345679999')
      .get('[data-test-id="email"]')
      .click({ force: true })
      .type('cypresshill@gmail.com')
      .fillTextInput('newPatientForm', 'birthDate', '10/10/2000')
      .submitForm('newPatientForm')
      .getAndClick('collapsible_0')
      .fillTextInput('demographics', 'search_firstName', 'Cypress')
      .fillTextInput('demographics', 'search_lastName', 'Hill')
      .get('[data-test-id="text_totalPatientsCount"]')
      .contains('Showing 1 Patients');
  });

  it('use smart filter - due in 60 days', () => {
    cy
      .wait(1500)
      .get('[data-test-id="dropDown_smartFilters"]')
      .click()
      .getAndClick('option_1')
      .get('[data-test-id="text_totalPatientsCount"]');
  });

  it('use smart filter - missed/cancelled appointment', () => {
    cy
      .wait(1500)
      .get('[data-test-id="dropDown_smartFilters"]')
      .click()
      .getAndClick('option_8')
      .get('[data-test-id="text_totalPatientsCount"]')
      .contains('Showing 1 Patients');
  });
});
