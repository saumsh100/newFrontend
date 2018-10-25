
context('Account Settings - Donna', () => {
  before(() => {
    cy.login();
    cy.getAndClick('dropDown_accounts')
      .get('[data-test-id="option_Liberty Chiropractic"]')
      .click({ force: true })
      .wait(1000);
  });

  after(() => {
    cy.getAndClick('dropDown_accounts')
      .get('[data-test-id="option_Test Account"]')
      .click({ force: true })
      .wait(1000);
  });

  context('Reminders Settings', () => {
    beforeEach(() => {
      cy.login('/settings/donna/reminders');
    });

    it('check reminder touch-point order', () => {
      cy.get('[data-test-id="touchPoint_reminder_0"]')
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
      cy.login('/settings/donna/recalls');
    });

    it('check recall touch-point order', () => {
      cy.get('[data-test-id="touchPoint_recall_0"]')
        .should('exist')
        .get('[data-test-id="touchPoint_recall_1"]')
        .should('exist');
    });
  });
});
