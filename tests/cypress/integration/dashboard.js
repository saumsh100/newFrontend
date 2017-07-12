
describe('Dashboard', () => {
  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds');
  });

  beforeEach(()=> {
    cy.login();
  });

  it('compare top card appointment request count with request list item count', () => {
    cy
      .get('[data-test-id="requestCount"]')
      .contains('3')
      .get('[data-test-id="JustinSharpAppointmentRequest"]')
      .should('exist')
      .get('[data-test-id="MarkJosephAppointmentRequest"]')
      .should('exist')
      .get('[data-test-id="JustineFrancoAppointmentRequest"]')
      .should('exist');
  });

  it('see a list and count of daily appointments on the dashboard', () => {
    cy
      .get('[data-test-id="appointmentCount"]')
      .contains('3')
      .get('[data-test-id="Alex0"]')
      .should('exist')
      .get('[data-test-id="Alex1"]')
      .should('exist')
      .get('[data-test-id="Alex2"]')
      .should('exist');
  });

  
})
