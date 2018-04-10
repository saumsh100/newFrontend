
context('Account Settings - Services and Practitioners', () => {
  beforeEach(() => {
    cy.login();
  });

  context('Services Settings', () => {

    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/services');
    });

    it('create a service', () => {
      cy
        .getAndClick('button_addService')
        .fillTextInput('createServiceForm', 'name', 'Test Service')
        .fillTextInput('createServiceForm', 'duration', 30)
        .submitForm('createServiceForm')
        .reload()
        .get('[data-test-id="serviceDataForm"]')
        .find('[data-test-id="name"]')
        .should('have.value', 'Test Service');
    });

    it('add practitioner to service', () => {
      cy
        .getAndClick('toggle_prac_0')
        .submitForm('servicePractitionersForm')
        .reload()
        .get('[data-test-id="toggle_prac_0"]')
        .find('.react-toggle--checked')
        .should('exist');
    });
  });

  context('Practitioner Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/practitioners');
    });

    it('update enable/disable state of a service', () => {
      cy
        .getAndClick('tab_practitionerServices')
        .getAndClick('toggle_pracService_1')
        .submitForm('practitionerServicesForm')
        .reload()
        .getAndClick('tab_practitionerServices')
        .get('[data-test-id=toggle_pracService_1]')
        .find('.react-toggle--checked')
        .should('not.exist');
    });

    it('add a new practitioner', () => {
      cy
        .getAndClick('button_addPractitioner')
        .fillTextInput('createPractitionerForm', 'firstName', 'Testly')
        .fillTextInput('createPractitionerForm', 'lastName', 'Testerson')
        .submitForm('createPractitionerForm')
        .reload()
        .get('[data-test-id="TestlyTesterson"]')
        .should('exist');
    });
  });
});
