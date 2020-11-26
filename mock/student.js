import { Model, Server } from 'miragejs';
const students = require('./student.json');

export default function makeServer({ environment = 'test' } = {}) {
  let server = new Server({
    environment,

    models: {
      student: Model,
    },

    seeds(server) {
      students.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') {
          return true;
        }
      });

      this.namespace = 'api';

      this.get('students', (schema, _) => {
        console.log('------->');
        return schema.students.all();
      });
    },
  });

  return server;
}
