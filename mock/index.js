import { format, subMonths } from 'date-fns';
import { countBy } from 'lodash';
import { belongsTo, hasMany, JSONAPISerializer, Model, Response, Server } from 'miragejs';

const students = require('./student.json');
const users = require('./user.json');
const courses = require('./course.json');
const studentCourses = require('./student_course.json');
const studentTypes = require('./student_type.json');
const courseTypes = require('./course_type.json');
const studentProfile = require('./student-profile.json');
const teachers = require('./teacher.json');
const sales = require('./sales.json');
const schedule = require('./schedule.json');
const teacherProfile = require('./teacher-profile.json');

export default function makeServer({ environment = 'test' } = {}) {
  let server = new Server({
    environment,

    models: {
      user: Model,
      studentType: Model,
      student: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
        profile: belongsTo('studentProfile'),
      }),
      courseType: Model,
      course: Model.extend({
        type: belongsTo('courseType'),
        teacher: belongsTo(),
        sales: belongsTo(),
        schedule: belongsTo(),
      }),
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
      studentProfile: Model.extend({
        studentCourses: hasMany(),
        type: belongsTo('studentType'),
      }),
      teacherProfile: Model,
      teacher: Model.extend({
        profile: belongsTo('teacherProfile'),
      }),
      sales: Model,
      schedule: Model,
    },

    serializers: {
      application: JSONAPISerializer,
    },

    seeds(server) {
      users.forEach((user) => server.create('user', user));
      teacherProfile.forEach((teacher) => server.create('teacherProfile', teacher));
      teachers.forEach((teacher) => server.create('teacher', teacher));
      courseTypes.forEach((type) => server.create('courseType', type));
      sales.forEach((sale) => server.create('sale', sale));
      schedule.forEach((schedule) => server.create('schedule', schedule));
      courses.forEach((course) => server.create('course', course));
      studentCourses.forEach((course) => server.create('studentCourse', course));
      studentTypes.forEach((type) => server.create('studentType', type));
      studentProfile.forEach((student) => server.create('studentProfile', student));
      students.forEach((student) => server.create('student', student));
    },

    routes() {
      this.passthrough((request) => {
        if (
          request.url === '/_next/static/development/_devPagesManifest.json' ||
          request.url.includes('mocky.io') || // 忽略上传图片的路径
          request.url.includes('dashboard') ||
          request.url.includes('amap') ||
          request.url.includes('highcharts')
        ) {
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
              data: {
                token: Math.random().toString(32).split('.')[1] + '~' + req.loginType,
                loginType: req.loginType,
              },
              code: 200,
              msg: 'login success',
            }
          );
        } else {
          return new Response(403, {}, { msg: 'Check user or email', code: 400 });
        }
      });

      this.get('/userType', (schema, req) => {
        const query = req.queryParams;
        const type = query.split('~')[1];

        if (!!type) {
          return new Response(200, {}, { data: type, msg: 'success', code: 200 });
        } else {
          return new Response(400, {}, { msg: 'Token is not exist', code: 400 });
        }
      });

      this.get('/students', (schema, req) => {
        const { query } = req.queryParams;
        const limit = +req.queryParams.limit;
        const page = +req.queryParams.page;
        const all = schema.students.all();
        let students = all.filter((item) => !query || item.name.includes(query)).models;
        const total = !query ? all.length : students.length;
        let data = { total, students };

        if (limit && page) {
          const start = limit * (page - 1);

          students = students.slice(start, start + limit);
          data = { ...data, paginator: { limit, page, total } };
        }

        students = students.map((student) => {
          const studentCourses = student.studentCourses;
          let courses = [];

          if (studentCourses.length) {
            courses = studentCourses.models.map((model) => {
              const name = model.course.name;

              return { name, id: +model.id };
            });
          }

          student.attrs.courses = courses;
          student.attrs.typeName = student.type.name;
          return student;
        });

        return new Response(200, {}, { data: { ...data, students }, msg: 'success', code: 200 });
      });

      this.post('/students/add', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const { name, email, area, type } = body;
        const data = schema.students.create({
          name,
          email,
          area,
          typeId: type,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        data.attrs.typeName = data.type.name;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/students/update', (schema, req) => {
        const { id, email, name, area, type } = JSON.parse(req.requestBody);
        const target = schema.students.findBy({ id });

        if (target) {
          const data = target.update({
            email,
            name,
            area,
            typeId: type,
            updateAt: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          });

          data.attrs.typeName = data.type.name;

          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(400, {}, { msg: `can\'t find student by id ${id} `, code: 400 });
        }
      });

      this.delete('/students/delete', (schema, req) => {
        const id = +req.queryParams.id;

        schema.students.find(id).destroy();

        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      this.post('/logout', (schema, _) => {
        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      this.get('/student', (schema, req) => {
        const id = req.queryParams.id;
        const student = schema.studentProfiles.findBy({ id }); // !FIXME: 前端传过来的实际是studentId, 不是studentProfileId
        const studentCourses = student.studentCourses;
        let courses = [];

        if (studentCourses.length) {
          courses = studentCourses.models.map((item) => {
            item.attrs.name = item.course.name;
            item.attrs.type = item.course.type.name;
            return item;
          });
        }

        student.attrs.courses = courses;
        student.attrs.typeName = student.type.name;

        if (student) {
          return new Response(200, {}, { msg: 'success', code: 200, data: student });
        } else {
          return new Response(400, {}, { msg: `can\'t find student by id ${id} `, code: 400 });
        }
      });

      this.get('/courses', (schema, req) => {
        const { page, limit, ...others } = req.queryParams;
        const conditions = Object.entries(others).filter(([key, value]) => !!value);
        let courses = schema.courses.all().models;
        const total = courses.length;

        if (page && limit) {
          courses = courses.slice((page - 1) * limit, page * limit);
        }

        if (conditions.length) {
          courses = courses.filter((item) =>
            conditions.every(([key, value]) => {
              if (key === 'name') {
                return item.name.includes(value);
              } else if (key === 'type') {
                return item.type.name === value;
              } else {
                return item[key] === value;
              }
            })
          );
        }

        courses.forEach((item) => {
          item.attrs.teacherName = item.teacher.name;
          item.attrs.typeName = item.type.name;
        });

        if (courses) {
          return new Response(200, {}, { msg: 'success', code: 200, data: { total, courses } });
        } else {
          return new Response(500, {}, { msg: 'server error', code: 500 });
        }
      });

      this.get('/course', (schema, req) => {
        const id = req.queryParams.id;
        const course = schema.courses.findBy({ id });

        course.attrs.teacher = course.teacher.name;
        course.attrs.sales = course.sales;
        course.attrs.typeName = course.type.name;
        course.attrs.schedule = course.schedule;

        if (!!course) {
          return new Response(200, {}, { msg: 'success', code: 200, data: course });
        } else {
          return new Response(400, {}, { msg: `can\'t find course by id ${id} `, code: 400 });
        }
      });

      this.get('/course/code', (schema, req) => {
        const data = Math.random().toString(32).split('.')[1];

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/course/type', (schema, req) => {
        const data = schema.courseTypes.all().models;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/courses/add', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const {
          name,
          uid,
          cover,
          detail,
          duration,
          maxStudents,
          price,
          startTime,
          typeId,
          durationUnit,
          teacherId,
        } = body;
        const schedule = schema.schedules.create({
          status: 0,
          current: 0,
          classTime: null,
          chapters: null,
        });
        const sales = schema.sales.create({
          batches: 0,
          price,
          earnings: 0,
          paidAmount: 0,
          studentAmount: 0,
          paidIds: [],
        });
        const data = schema.db.courses.insert({
          name,
          uid,
          detail,
          startTime,
          price,
          maxStudents,
          sales,
          schedule,
          star: 0,
          status: 0,
          duration,
          durationUnit,
          cover,
          teacherId,
          typeId,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        data.typeName = schema.courseTypes.findBy({ id: typeId }).name;
        data.scheduleId = +schedule.id;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/courses/update', (schema, req) => {
        const { id, ...others } = JSON.parse(req.requestBody);
        const target = schema.courses.findBy({ id });

        if (target) {
          const data = target.update({
            ...others,
          });

          data.attrs.typeName = data.type.name;

          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(400, {}, { msg: `can\'t find course by id ${id} `, code: 400 });
        }
      });

      this.get('/courses/schedule', (schema, req) => {
        const id = req.queryParams.id;
        const data = schema.schedules.findBy({ id });

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/courses/schedule', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const { scheduleId, courseId } = body;
        let target;

        if (!!scheduleId || !!courseId) {
          if (scheduleId) {
            target = schema.schedules.findBy({ id: scheduleId });
          } else {
            target = schema.courses.findBy({ id: courseId }).schedule;
          }
          const { classTime, chapters } = body;

          target.update({
            current: 0,
            status: 0,
            chapters: chapters.map((item, index) => ({ ...item, id: index })),
            classTime,
          });

          return new Response(200, {}, { msg: 'success', code: 200, data: true });
        } else {
          return new Response(
            400,
            {},
            {
              msg: `can\'t find schedule by course ${courseId} or schedule ${scheduleId} `,
              code: 400,
            }
          );
        }
      });

      this.get('/teachers', (schema, req) => {
        const { query } = req.queryParams;
        const limit = +req.queryParams.limit;
        const page = +req.queryParams.page;
        const all = schema.teachers.all();
        let teachers = all.filter(
          (item) => !query || item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        ).models;
        const total = !query ? all.length : teachers.length;
        let data = { total, teachers };

        if (limit && page) {
          const start = limit * (page - 1);

          teachers = teachers.slice(start, start + limit);
          data = { ...data, paginator: { limit, page, total } };
        }

        return new Response(200, {}, { data: { ...data, teachers }, msg: 'success', code: 200 });
      });

      this.get('/teacher', (schema, req) => {
        const id = req.queryParams.id;
        const data = schema.teachers.find(id);
        const courses = schema.courses.where((course) => course.teacherId === +id).models;

        data.attrs.profile = data.profile;
        data.attrs.profile.attrs.courses = courses;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/teachers/add', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const { name, phone, country, email, skills } = body;
        const data = schema.teachers.create({
          name,
          email,
          phone,
          country,
          skills,
          courseAmount: 0,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          updateAt: null,
        });

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/teachers/update', (schema, req) => {
        const { id, email, name, country, skills, phone } = JSON.parse(req.requestBody);
        const target = schema.teachers.findBy({ id });

        if (target) {
          const data = target.update({
            email,
            name,
            country,
            skills,
            phone,
            updateAt: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          });

          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(400, {}, { msg: `can\'t find student by id ${id} `, code: 400 });
        }
      });

      this.delete('/teachers/delete', (schema, req) => {
        const id = +req.queryParams.id;

        schema.teachers.find(id).destroy();

        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      this.get('/statistics/overview', (schema, req) => {
        const courses = schema.courses.all().models;
        const data = {
          student: getPeopleStatistics(schema, 'students'),
          teacher: getPeopleStatistics(schema, 'teachers'),
          course: {
            total: courses.length,
            lastMonthAdded: schema.courses.where(
              (item) => new Date(item.ctime) >= subMonths(new Date(), 1)
            ).models.length,
          },
        };

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/statistics/student', (schema, req) => {
        const source = schema.students.all().models;
        const data = {
          area: getStatisticList(countBy(source, 'area')),
          typeName: getStatisticList(countBy(source, (item) => item.type.name)),
          courses: getStatisticList(
            source.reduce((acc, item) => {
              const courses = item.studentCourses.models.map((item) => item.course.name);
              const accumulate = accumulateFactory(acc);

              courses.forEach(accumulate);
              return acc;
            }, {})
          ),
          ctime: getStatisticList(countBy(source, (item) => {
            const index = item.ctime.lastIndexOf('-');
            
            return item.ctime.slice(0, index);
          })),
          interest: getStatisticList(
            source
              .map((item) => item.profile.interest)
              .reduce((acc, cur) => {
                const accumulate = accumulateFactory(acc);

                cur.forEach(accumulate);
                return acc;
              }, {})
          ),
        };

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });
    },
  });

  return server;
}

function getPeopleStatistics(schema, type) {
  const all = schema[type].all().models;
  const male = all.filter((item) => item.profile?.gender === 1).length;
  const female = all.filter((item) => item.profile?.gender === 2).length;

  return {
    total: all.length,
    lastMonthAdded: schema.teachers.where(
      (item) => new Date(item.ctime) >= subMonths(new Date(), 1)
    ).models.length,
    gender: { male, female, unknown: all.length - male - female },
  };
}

function getStatisticList(obj) {
  return Object.entries(obj).map(([name, amount]) => ({ name, amount }));
}

function accumulateFactory(acc) {
  return (key) => {
    if (acc.hasOwnProperty(key)) {
      acc[key] = acc[key] + 1;
    } else {
      acc[key] = 1;
    }
  };
}
