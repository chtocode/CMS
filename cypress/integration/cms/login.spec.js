/// <reference types="cypress" />

describe('Login page', () => {
  beforeEach(function () {
    cy.visit('/login');
    cy.fixture('cms.users').then((users) => {
      this.users = users;
    });
  });

  it('should display title', () => {
    cy.contains('Course Management Assistant');
  });

  it('should display login form', () => {
    const roles = ['Student', 'Teacher', 'Manager'];

    cy.get('input[type=radio]').should('have.length', roles.length);

    roles.forEach((role) => {
      cy.get('label').contains(role);
    });

    cy.get('input[type=email]').should('be.visible');

    cy.get('input[type=password]').should('be.visible');

    // 这个元素不可见，opacity:0
    cy.get('input[type=checkbox]').should('be.checked');

    cy.get('button[type=submit]').should('be.visible');
  });

  it('should have sign up entrance', () => {
    cy.contains('Sign up').should('be.visible').and('have.attr', 'href');
  });

  it('should display validate message', () => {
    cy.get('input[type=email]').type('xxxxxxx');

    cy.get('#login .ant-row').find('[role=alert]').should('be.visible');

    cy.get('input[type=password]').type('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    cy.get('#login .ant-row').find('[role=alert]').should('be.visible').and('have.length', 2);
  });

  it('should can login in with manager account', function () {
    const manager = this.users.find((user) => user.role === 'manager');
    cy.get('label').contains('Manager').click();
    cy.get('input[type=email]').type(manager.email).should('have.value', manager.email);
    cy.get('input[type=password]').type(manager.password).should('have.value', manager.password);

    cy.intercept('POST', '/api/login', {
      code: 200,
      msg: 'success',
      data: {
        userId: 3,
        token: Cypress.env().managerToken,
        role: 'manager',
      },
    });

    cy.get('button[type=submit]')
      .click()
      .then(() => {
        cy.url().should('include', 'dashboard');
      });
  });
});
