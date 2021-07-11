/// <reference types="cypress" />

describe('home page', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('should contain logo', () => {
    cy.get('#logo');
  });

  it('can back to home page', () => {
    cy.intercept('http://localhost:3000/events');
    cy.get('#header').click();
    cy.contains('The best learning methods').should('be.visible');
  });

  it('should have 5 menu', () => {
    cy.get('#header a').should('have.length', '5').and('have.attr', 'href');
  });

  it('Header should always in top screen', () => {
    cy.scrollTo('bottom');
    cy.get('#header').should('be.visible');
  });
});
