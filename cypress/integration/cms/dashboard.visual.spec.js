/// <reference types="cypress" />

describe('Dashboard Visual Testing', () => {
  beforeEach(() => {
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

    cy.login('manager@admin.com', '111111');
  });

  it('Overview', () => {
    cy.wait(['@overviewRes', '@studentRes', '@teacherRes', '@courseRes'], { timeout: 10000 }).then(
      () => {
        // wait for the first overview panel display
        cy.get('.ant-card').first().should('be.visible');

        cy.get('.ant-card').first().toMatchImageSnapshot({
          threshold: 0.1,
          thresholdType: 'pixels',
        });
        
        // wait for svg render
        cy.wait(10000);

        cy.get('.ant-card').eq(4).should('be.visible');
        cy.get('.ant-card').eq(4).matchImageSnapshot();
      }
    );
  });
});
