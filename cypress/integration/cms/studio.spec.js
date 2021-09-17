/// <reference types="cypress" />
import { addDays, format } from 'date-fns';

describe('Student list', () => {
  beforeEach(() => {
    cy.login('manager@admin.com', '111111').then(() => {
      cy.visit('/dashboard/manager/students');
    });
  });

  it('Search student', () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.ant-input').clear();
    cy.get('.ant-input').type('per');
    cy.get('[data-row-key="69"] > :nth-child(2) > a').click();
    /* ==== End Cypress Studio ==== */
  });
});
