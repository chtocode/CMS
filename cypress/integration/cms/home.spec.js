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

  /* ==== Test Created with Cypress Studio ==== */
  it('navigate between pages', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#menu > :nth-child(2) > :nth-child(1) > a').click();
    cy.get('.widget > ul > :nth-child(4) > a').click();
    cy.get('#menu > :nth-child(1) > :nth-child(2) > a').click();
    cy.get('#menu > :nth-child(2) > :nth-child(2) > a').click();
    cy.get('#logo').click();
    cy.get('.header__SignIn-sc-19law7x-0 > a').click();
    /* ==== End Cypress Studio ==== */
  });
});
