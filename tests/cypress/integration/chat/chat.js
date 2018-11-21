
describe('Chat Tests', () => {
  before(() => {
    cy.login();
    cy.getAndClick('dropDown_accounts')
      .get('[data-test-id="option_Liberty Chiropractic"]')
      .click({ force: true })
      .wait(1000);
  });

  beforeEach(() => {
    cy.login('/chat');
  });

  after(() => {
    cy.getAndClick('dropDown_accounts')
      .get('[data-test-id="option_Test Account"]')
      .click({ force: true });
  });

  describe('General tests', () => {
    it('forces All tab when creating new chat', () => {
      cy.get('[data-test-id="unread_chatTab"]')
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
      cy.get('[data-test-id="button_addNewChat"]')
        .click({ force: true })
        .get('[data-test-id="input_chatSearch"]')
        .find('input')
        .type('Testy')
        .parent()
        .next()
        .contains('Testy Testerson')
        .click({ force: true })
        .wait(1000)
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
      cy.receiveTextMessage(
        '72954241-3652-4792-bae5-5bfed53d37b7',
        '906-594-6264',
        '+15874003884',
        'Hello to you too!',
      )
        .get('[data-test-id="item_chatMessage"]')
        .contains('Hello to you too!');
    });

    it('marks chat as unread if new message is received', () => {
      cy.get('[data-test-id="button_addNewChat"]')
        .click({ force: true })
        .get('[data-test-id="input_chatSearch"]')
        .find('input')
        .type('Testen')
        .parent()
        .next()
        .contains('Testen Testerson')
        .click({ force: true })
        .wait(1000)
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
        .get('[data-test-id="chat_lastMessage"]')
        .contains('Hello new message!')
        .invoke('attr', 'class')
        .should('contain', 'bottomSectionUnread');
    });

    it('marks chat as read when its selected', () => {
      cy.receiveTextMessage(
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
      cy.get('[data-test-id="chat_unreadDots"]')
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

  describe('Unknown Number test', () => {
    it('Receive / Send', () => {
      cy.receiveTextMessage(
        '72954241-3652-4792-bae5-5bfed53d37b7',
        '+11111111111',
        '+15874003884',
        'Hi, I am Unknown',
      )
        .get('[data-test-id="chat_lastMessage"]')
        .contains('Hi, I am Unknown')
        .click({ force: true })
        .get('[data-test-id="chatMessageForm"]')
        .get('[data-test-id="message"]')
        .click({ force: true })
        .type('Hello Unknown')
        .get('[data-test-id="button_sendMessage"]')
        .click({ force: true })
        .wait(1000)
        .get('[data-test-id="item_chatMessage"]')
        .contains('Hello Unknown');
    });

    it('Open List of Patient and add', () => {
      cy.login('/patients/list')
        .getAndClick('button_addNewPatient')
        .fillTextInput('newPatientForm', 'firstName', 'Boba')
        .fillTextInput('newPatientForm', 'lastName', 'Fett')
        .selectOption('newPatientForm', 'gender', 'option_0')
        .fillTextInput('newPatientForm', 'mobilePhoneNumber', '+11111111111')
        .get('[data-test-id="email"]')
        .click({ force: true })
        .type('boba.fett@carecru.com')
        .fillTextInput('newPatientForm', 'birthDate', '11/11/2011')
        .submitForm('newPatientForm')
        .wait(500)
        .get('[data-test-id="patientAssignConfirm"]')
        .get('[data-test-id="patientAssignConfirmYes"]')
        .click({ force: true })
        .visit(`${Cypress.env('siteURL')}/chat`)
        .get('[data-test-id="chat_patientName"]')
        .contains('Boba Fett');
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

    it('shows only 15 messages initially', () => {
      cy.get('[data-test-id="item_chatMessage"]')
        .its('length')
        .should('eq', 15);
    });

    it('loads more messages on scroll', () => {
      cy.get('[data-test-id="item_chatMessage"]')
        .first()
        .scrollIntoView({ duration: 2000 })
        .wait(1000)
        .get('[data-test-id="item_chatMessage"]')
        .its('length')
        .should('eq', 32);
    });
  });
});
