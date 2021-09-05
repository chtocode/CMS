/// <reference types="cypress" />
import { AES } from 'crypto-js';

describe('login api', () => {
  context('POST /login', () => {
    it('should login with student account', () => {
      const pwd = AES.encrypt('111111', 'cms').toString(); // 需要加密后发送
      const options = {
        method: 'POST',
        url: `${Cypress.env().prod}/login`,
        body: {
          email: 'student@admin.com',
          password: pwd,
          role: 'student',
        },
      };

      cy.request(options).then((res) => {
        const data = res.body.data;

        expect(data.role).eq('student');
        expect(data.token).exist;
        expect(typeof data.userId).eq('number');
      });
    });
  });
});
