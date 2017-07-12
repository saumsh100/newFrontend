
describe('Dashboard', () => {
  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds');
  });

  beforeEach(()=> {
    cy.login();
  });

  it('compare top card appointment request count with request list item count', () => {
    cy
      .get('[data-test-id="cardCount"]')
      .contains('3')
      .get('[data-test-id="JustinSharpAppointmentRequest"]')
      .should('exist')
      .get('[data-test-id="MarkJosephAppointmentRequest"]')
      .should('exist')
      .get('[data-test-id="JustineFrancoAppointmentRequest"]')
      .should('exist');
  });
})
