
describe('Dashboard', () => {
  before(() => {
    cy.exec('env NODE_ENV="test" npm run seeds')
  });

  beforeEach(() => {
    cy.login();
  });

  context('Dashboard', () => {
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

    it('see a total count and listing of daily appointments', () => {
      cy
        .get('[data-test-id="appointmentCount"]')
        .contains('3')
        .get('[data-test-id="0_appointment"]')
        .should('exist')
        .get('[data-test-id="1_appointment"]')
        .should('exist')
        .get('[data-test-id="2_appointment"]')
        .should('exist');
    });

    it('see a total count and listing of sent reminders', () => {
      cy
        .get('[data-test-id="sentRemindersCount"]')
        .contains('1')
        .get('[data-test-id="0_sentReminder"]')
        .should('exist');
    });

    it('see a total count and listing of sent recalls', () => {
      cy
        .get('[data-test-id="sentRecallsCount"]')
        .contains('1')
        .get('[data-test-id="0_sentRecall"]')
        .should('exist');
    });

    it('see a total count and listing of digital wait lists', () => {
      cy
        .get('[data-test-id="waitListCount"]')
        .contains('3')
        .get('[data-test-id="0_waitList"]')
        .should('exist')
        .get('[data-test-id="1_waitList"]')
        .should('exist')
        .get('[data-test-id="2_waitList"]')
        .should('exist');
    });
  });
});
