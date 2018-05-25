
context('Account Settings - Donna', () => {
  beforeEach(() => {
    cy.login();
  });

  context('Reminders Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/donna/reminders');
    });

    it('check reminder touch-point order', () => {
      cy
        .getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="touchPoint_reminder_0"]')
        .should('exist')
        .get('[data-test-id="touchPoint_reminder_1"]')
        .should('exist')
        .get('[data-test-id="touchPoint_reminder_2"]')
        .should('exist')
        .get('[data-test-id="touchPoint_reminder_3"]')
        .should('exist');
    });
  });

  context('Recalls Settings', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5100/settings/donna/recalls');
    });

    it('check recall touch-point order', () => {
      cy
        .getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="touchPoint_recall_0"]')
        .should('exist')
        .get('[data-test-id="touchPoint_recall_1"]')
        .should('exist');
    });
  });
});
