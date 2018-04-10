
describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.login();
  });

  it('confirming correct stats count for all cards', () => {
    cy
      .get('[data-test-id="statCard_Online Requests"]')
      .contains('0')
      .get('[data-test-id="statCard_Patient Insights"]')
      .contains('3')
      .get('[data-test-id="statCard_Appointments Today"]')
      .contains('3')
      .get('[data-test-id="statCard_Patients Unconfirmed"]')
      .contains('3');
  });

  it('confirming the correct number of reviews', () => {
    cy
      .getAndClick('reviewRequestsTab')
      .get('[data-test-id="list_donnaReviews"]')
      .should('have.length', 3);
  });
});
