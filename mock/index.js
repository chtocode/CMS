import { Model, Response, Server } from 'miragejs';
const students = require('./student.json');

export default function makeServer({ environment = 'test' } = {}) {
  let server = new Server({
    environment,

    models: {
      user: Model,
      student: Model,
    },

    seeds(server) {
      server.create('user', {
        email: 'student@admin.com',
        password: '123456',
        loginType: 'student',
      });
      server.create('user', {
        email: 'teacher@admin.com',
        password: '123456',
        loginType: 'teacher',
      });
      server.create('user', {
        email: 'manager@admin.com',
        password: '123456',
        loginType: 'manager',
      });
      students.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') {
          return true;
        }
      });

      this.namespace = 'api';

      this.post('/login', (schema, request) => {
        const req = JSON.parse(request.requestBody);
        const user = schema.users.where({
          email: req.email,
          password: req.password,
          loginType: req.loginType,
        });

        if (!!user.length) {
          return new Response(
            200,
            {},
            { token: Math.random().toString(32).split('.')[1], loginType: req.loginType }
          );
        } else {
          return new Response(400, {}, { msg: 'Check user or email' });
        }
      });

      this.get('/students', (schema, _) => {
        return schema.students.all();
      });
    },
  });

  return server;
}
