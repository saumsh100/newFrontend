
describe('Chat Tests', () => {
  beforeEach(() => {
    cy.login();
  });

  describe('General tests', () => {
    beforeEach(() => {
      cy.visit(`${Cypress.env('siteURL')}/chat`);
    });

    it('forces All tab when creating new chat', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="unread_chatTab"]')
        .click({ force: true })
        .get('[data-test-id="input_chatSearch"]')
        .find('input')
        .type('Testy')
        .parent()
        .next()
        .contains('Testy Testerson')
        .click({ force: true })
        .get('[data-test-id="all_chatTab"]')
        .invoke('attr', 'class')
        .should('contain', 'activeTab');
    });

    it('initiate a new conversation with a patient', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="button_addNewChat"]')
        .click({ force: true })
        .get('[data-test-id="input_chatSearch"]')
        .find('input')
        .type('Testy')
        .parent()
        .next()
        .contains('Testy Testerson')
        .click({ force: true })
        .get('[data-test-id="chatMessageForm"]')
        .get('[data-test-id="message"]')
        .click({ force: true })
        .type('Hello')
        .get('[data-test-id="chatMessageForm"]')
        .get('[data-test-id="button_sendMessage"]')
        .click({ force: true })
        .get('[data-test-id="item_chatMessage"]')
        .should('exist');
    });

    it('receives a message from the patient', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .receiveTextMessage(
          '72954241-3652-4792-bae5-5bfed53d37b7',
          '906-594-6264',
          '+15874003884',
          'Hello to you too!',
        )
        .wait(1000)
        .get('[data-test-id="item_chatMessage"]')
        .contains('Hello to you too!');
    });

    it('marks chat as unread if new message is received', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="button_addNewChat"]')
        .click({ force: true })
        .get('[data-test-id="input_chatSearch"]')
        .find('input')
        .type('Testen')
        .parent()
        .next()
        .contains('Testen Testerson')
        .click({ force: true })
        .get('[data-test-id="chatMessageForm"]')
        .get('[data-test-id="message"]')
        .click({ force: true })
        .type('Hello')
        .get('[data-test-id="chatMessageForm"]')
        .get('[data-test-id="button_sendMessage"]')
        .click({ force: true })
        .wait(1000)
        .receiveTextMessage(
          '72954241-3652-4792-bae5-5bfed53d37b7',
          '906-594-6264',
          '+15874003884',
          'Hello new message!',
        )
        .wait(1000)
        .get('[data-test-id="chat_lastMessage"]')
        .contains('Hello new message!')
        .invoke('attr', 'class')
        .should('contain', 'bottomSectionUnread');
    });

    it('marks chat as read when its selected', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .receiveTextMessage(
          '72954241-3652-4792-bae5-5bfed53d37b7',
          '906-594-6265',
          '+15874003884',
          'Hello new message again!',
        )
        .wait(1000)
        .get('[data-test-id="chat_lastMessage"]')
        .contains('Hello new message again!')
        .click({ force: true })
        .invoke('attr', 'class')
        .should('not.contain', 'bottomSectionUnread');
    });

    it('marks chat as unread on request', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="chat_unreadDots"]')
        .first()
        .trigger('mouseover')
        .get('[data-test-id="chat_markUnreadBtn"]')
        .click({ force: true })
        .get('[data-test-id="chat_lastMessage"]')
        .contains('Hello new message again!')
        .invoke('attr', 'class')
        .should('contain', 'bottomSectionUnread')
        .get('[data-test-id="unread_chatTab"]')
        .click({ force: true })
        .get('[data-test-id="chat_lastMessage"]')
        .contains('Hello new message again!')
        .should('exist');
    });
  });

  describe('Infinite loading', () => {
    before(() => {
      for (let i = 0; i < 30; i++) {
        cy.receiveTextMessage(
          '72954241-3652-4792-bae5-5bfed53d37b7',
          '906-594-6265',
          '+15874003884',
          'Hello new message again!',
        );
      }
    });

    beforeEach(() => {
      cy.visit(`${Cypress.env('siteURL')}/chat`);
    });

    it('shows only 15 messages initially', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="item_chatMessage"]')
        .its('length')
        .should('eq', 15);
    });

    it('loads more messages on scroll', () => {
      cy.getAndClick('dropDown_accounts')
        .get('[data-test-id="option_Liberty Chiropractic"]')
        .click({ force: true })
        .wait(5000)
        .get('[data-test-id="item_chatMessage"]')
        .first()
        .scrollIntoView({ duration: 2000 })
        .wait(1000)
        .get('[data-test-id="item_chatMessage"]')
        .its('length')
        .should('eq', 32);
    });
  });
});
