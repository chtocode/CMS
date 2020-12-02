import { Model, Response, Server } from 'miragejs';

const students = require('./student.json');
const users = require('./user.json');

export default function makeServer({ environment = 'test' } = {}) {
  let server = new Server({
    environment,

    models: {
      user: Model,
      student: Model,
    },

    seeds(server) {
      users.forEach((user) => server.create('user', user));
      students.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') {
          return true;
        }
      });

      this.namespace = 'api';

      this.get('/login', (schema, request) => {
        const req = request.queryParams;
        const user = schema.users.where({
          email: req.email,
          password: req.password,
          type: req.loginType,
        });

        if (!!user.length) {
          return new Response(
            200,
            {},
            {
              data: { token: Math.random().toString(32).split('.')[1], loginType: req.loginType },
              code: 200,
              msg: 'login success',
            }
          );
        } else {
          return new Response(403, {}, { msg: 'Check user or email', code: 400 });
        }
      });

      this.get('/students', (schema, _) => {
        return new Response(
          200,
          {},
          { data: { students: schema.students.all().models }, msg: 'success', code: 200 }
        );
      });

      this.post('/logout', (schema, _) => {
        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });
    },
  });

  return server;
}
