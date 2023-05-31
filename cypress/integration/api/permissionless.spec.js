/// <reference types="cypress" />

describe('Api without authorization', () => {
  context('GET /degrees', () => {
    it('get a list of degree', () => {
      cy.request('GET', `${Cypress.env().prod}/degrees`).then((res) => {
        const data = res.body.data;
        expect(res.status).to.eq(200);
        expect(Array.isArray(data)).to.be.true;
        expect(data.length).to.eq(9);
      });
    });
  });

  context('GET /countries', () => {
    it('get country list', () => {
      cy.request('GET', `${Cypress.env().prod}/countries`).then((res) => {
        const data = res.body.data;
        expect(res.status).to.eq(200);
        expect(data.length).to.eq(230);
      });
    });
  });
});
