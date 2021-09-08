/// <reference types="cypress" />

describe('Visual Testing', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it.only('logo testing', () => {
    cy.get('#logo').toMatchImageSnapshot();
  });

  it('logo testing after scrolled', () => {
    cy.scrollTo(0, 300);
    cy.get('#logo').toMatchImageSnapshot();

    cy.scrollTo('bottom');
    cy.get('#logo').toMatchImageSnapshot();
  });
});
