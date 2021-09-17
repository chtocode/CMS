/// <reference types="cypress" />

describe('Dashboard Visual Testing', () => {
  before(() => {
    cy.login('manager@admin.com', '111111');

    cy.intercept('GET', '/api/statistics/overview', { fixture: 'overview.json' }).as('overviewRes');
    cy.intercept('GET', '/api/statistics/student', { fixture: 'student-statistics.json' }).as(
      'studentRes'
    );
    cy.intercept('GET', '/api/statistics/teacher', { fixture: 'teacher-statistics.json' }).as(
      'teacherRes'
    );
    cy.intercept('GET', '/api/statistics/course', { fixture: 'course-statistics.json' }).as(
      'courseRes'
    );

    cy.wait(['@overviewRes', '@studentRes', '@teacherRes', '@courseRes'], { timeout: 10000 });
  });

  it('Overview', () => {
    cy.get('.ant-card').first().should('be.visible');

    cy.get('.ant-card').first().toMatchImageSnapshot({
      threshold: 0.1,
      thresholdType: 'pixels',
    });
  });
  
  it('Distribution', () => {
    cy.get('.ant-card').eq(3).should('be.visible');
    cy.get('.ant-card').eq(3).matchImageSnapshot();
  });

  it('Types', () => {
    cy.get('.ant-card').eq(4).should('be.visible');
    cy.get('.ant-card').eq(4).matchImageSnapshot();
  });
});
