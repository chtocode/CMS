/// <reference types="cypress" />

describe('Add course', () => {
  before(() => {
    cy.login('manager@admin.com', '111111').then(() => {
      cy.visit('/dashboard/manager/courses/add-course');
    });
  });

  it('should display correct form elements', () => {
    cy.get('#name').type('abcdef');
    cy.get('#teacherId').type('ee');
    cy.intercept('GET', '/api/teachers?query=ee').as('teachersRes');
    cy.intercept('GET', '/api/courses/type').as('types');

    cy.get('.ant-select-item-option-content').first().click();

    cy.get('#type').click();

    cy.get('.ant-select-item-option').contains('Visual Basic').click();

    cy.get('.ant-select-item-option').contains('Swift').click();

    //     cy.get('#uid');
    cy.get('#startTime')
      .click()
      .then(() => {
        cy.get(`td[title=2021-08-21]`).click(); // date-fn get to day
      });

    cy.get('#price').type(9);

    cy.get('#maxStudents').type(2);

    cy.get(
      '.ant-input-group > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input'
    ).type(3);

    cy.get('.ant-input-group > .ant-select > .ant-select-selector')
      .click()
      .then(() => {
        cy.get('.ant-select-item-option-content').contains('week').click();
      });

    cy.get('#detail').type(
      ' The Cypress Dashboard Service is an optional web-based companion to the Test Runner.  It provides timely, simple and powerful insights on all your tests run at a glance.  With automatic parallelization and load balancing you can optimize CI and run significantly faster tests.  '
    );
  });
});
