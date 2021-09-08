/// <reference types="cypress" />

describe('iTesting demo', () => {
  it('visual testing', () => {
    cy.visit('https://www.baidu.com');
    cy.get('#kw').type('iTesting');
    cy.get('#su').click();
    cy.get('.result.c-container.new-pmd')
      .eq(0)
      .then((ele) => {
        expect(ele.text(), '验证第一个结果的text里包括iTesting').to.includes(
          'iTesting软件测试知识分享'
        );
      });
    cy.get('.result.c-container.new-pmd').eq(6).toMatchImageSnapshot();
  });
});
