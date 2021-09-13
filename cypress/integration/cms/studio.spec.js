/// <reference types="cypress" />
import { addDays, format } from 'date-fns';

describe('Student list', () => {
  beforeEach(() => {
    cy.login('manager@admin.com', '111111').then(() => {
      cy.visit('/dashboard/manager/students');
    });
  });

  it('Search student', () => {});
});
