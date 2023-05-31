/// <reference types="cypress" />

let id;

describe('Student Api', () => {
  context('GET /students', () => {
    it('get a list of students', () => {
      const token = Cypress.env().managerToken;
      const authorization = `bearer ${token}`;
      const options = {
        method: 'GET',
        url: `${Cypress.env().prod}/students?page=1&limit=5`,
        headers: {
          authorization,
        },
      };

      cy.request(options).then((res) => {
        const data = res.body.data;
        expect(res.status).to.eq(200);
        expect(data.students.length).eq(5);
      });
    });
  });

  context('POST /students', () => {
    it('can create a student', () => {
      const token = Cypress.env().managerToken;
      const authorization = `bearer ${token}`;
      const options = {
        method: 'POST',
        url: `${Cypress.env().prod}/students`,
        headers: {
          authorization,
        },
        body: {
          name: 'zhang san',
          country: 'Canada',
          email: 'zhao4@gmail.com',
          type: 0,
        },
      };

      cy.request(options).then((res) => {
        const data = res.body.data;
        expect(res.status).to.eq(201);
        expect(data.id).exist;
        id = data.id;
      });
    });
  });

  context('PUT /students', () => {
    it('update student', () => {
      const token = Cypress.env().managerToken;
      const authorization = `bearer ${token}`;
      const options = {
        method: 'PUT',
        url: `${Cypress.env().prod}/students`,
        headers: {
          authorization,
        },
        body: {
          id,
          name: 'Prof. Maxie Grant III',
          country: 'China',
          type: 2,
          email: 'danielle78@example.com',
        },
      };
      cy.request(options).then((res) => {
        const data = res.body.data;
        expect(data.id).to.eq(id);
      });
    });
  });

  context('DELETE /students', () => {
    it('can delete student', () => {
      const token = Cypress.env().managerToken;
      const authorization = `bearer ${token}`;
      const options = {
        method: 'DELETE',
        url: `${Cypress.env().prod}/students/${id}`,
        headers: {
          authorization,
        },
      };
      cy.request(options).then((res) => {
        const data = res.body.data;
        expect(res.status).to.eq(200);
      });
    });
  });
});
