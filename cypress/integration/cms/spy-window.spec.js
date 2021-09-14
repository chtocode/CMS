/// <reference types="cypress" />

describe('window ready ', function () {
  beforeEach(function () {
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.spy(win.document, 'onload').as('win.onload');
      },
    });
  });

  it('window onload should be called', function () {
    cy.get('@win.onload').should('be.called');
  });
});
