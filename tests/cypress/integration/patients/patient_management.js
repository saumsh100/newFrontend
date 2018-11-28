
describe('Patient Management Table Tests', () => {
  beforeEach(() => {
    cy.login('/patients/list');
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
      .contains('Showing 1 Patient');
  });
});
