import { format, formatDistance, isSameMonth, subMonths } from 'date-fns';
import { countBy, groupBy, intersection, uniq } from 'lodash';
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
const degree = require('./degree.json');
const country = require('./country.json');

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
      degree: Model,
      country: Model,
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
      degree.forEach((degree) => server.create('degree', degree));
      country.forEach((country) => server.create('country', country));
    },

    routes() {
      const passthroughKeywords = ['mocky.io', 'dashboard', 'amap', 'highcharts', 'message'];
      this.passthrough((request) => {
        if (
          request.url === '/_next/static/development/_devPagesManifest.json' ||
          passthroughKeywords.some((words) => request.url.includes(words))
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
          type: req.role,
        });

        if (!!user.length) {
          return new Response(
            200,
            {},
            {
              data: {
                token: Math.random().toString(32).split('.')[1] + '~' + req.role,
                role: req.role,
                userId: user.models[0].id,
              },
              code: 200,
              msg: 'login success',
            }
          );
        } else {
          return new Response(403, {}, { msg: 'Check user or email', code: 400 });
        }
      });

      this.post('/logout', (schema, _) => {
        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      this.get('/userRole', (schema, req) => {
        const query = req.queryParams;
        const type = query.split('~')[1];

        if (!!type) {
          return new Response(200, {}, { data: type, msg: 'success', code: 200 });
        } else {
          return new Response(400, {}, { msg: 'Token is not exist', code: 400 });
        }
      });

      this.post('/signup', (schema, req) => {
        const { email, role, password } = JSON.parse(req.requestBody);

        const data = schema.users.create({
          email,
          role,
          password,
        });

        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      /* ----------------------------------------student api------------------------------------- */

      this.get('/students', (schema, req) => {
        const { query, userId } = req.queryParams;
        const permission = getPermission(req);
        const limit = +req.queryParams.limit;
        const page = +req.queryParams.page;
        const all = schema.students.all();
        const getResult = (students, total) => {
          students = students.slice(limit * (page - 1), limit * page);
          students = students.map((student) => {
            const studentCourses = student.studentCourses;
            let courses = [];

            if (studentCourses.length) {
              courses = studentCourses.models.map((model) => {
                const name = model.course.name;

                return { name, id: +model.id, courseId: model.course.id };
              });
            }

            student.attrs.courses = courses;
            student.attrs.typeName = student.type.name;
            return student;
          });

          return { total, paginator: { limit, page, total }, students };
        };
        let data = null;

        if (permission === 9) {
          let students = all.filter((item) => !query || item.name.includes(query)).models;
          const total = !query ? all.length : students.length;

          data = getResult(students, total);
        } else if (permission === 2) {
          const user = schema.users.find(userId);
          const teacher = schema.teachers.findBy({ email: user.email });
          const courses = schema.courses.all().filter((item) => item.teacherId === +teacher.id)
            .models;
          const courseIds = courses.map((item) => +item.id);
          const studentsBelongTeacher = all.models
            .map((item) => {
              const ids = intersection(
                item.studentCourses.models.map((item) => item.courseId),
                courseIds
              );

              // omit the courses does not belong to the teacher
              item.studentCourses = item.studentCourses.filter((item) =>
                ids.includes(+item.courseId)
              );

              return item.studentCourses.length ? item : null;
            })
            .filter((item) => !!item);
          const students = studentsBelongTeacher.filter(
            (item) => !query || item.name.includes(query)
          );
          const total = !query ? studentsBelongTeacher.length : students.length;

          data = getResult(students, total);
        } else if (permission === 1) {
          return new Response(403, {}, { msg: 'Permission denied', code: 403, data: null });
        }

        return new Response(200, {}, { data, msg: 'success', code: 200 });
      });

      this.post('/students/add', (schema, req) => {
        const body = JSON.parse(req.requestBody);
        const { name, email, country, type } = body;
        const data = schema.students.create({
          name,
          email,
          country,
          typeId: type,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        data.attrs.typeName = data.type.name;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/students/update', (schema, req) => {
        const { id, email, name, country, type } = JSON.parse(req.requestBody);
        const target = schema.students.findBy({ id });

        if (target) {
          const data = target.update({
            email,
            name,
            country,
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

      this.get('/class/schedule', (schema, req) => {
        const permission = getPermission(req);
        const userId = req.queryParams.userId;
        const user = schema.users.find(userId);
        let data = null;

        if (permission === 1) {
          data = schema.students.findBy({ email: user.email }).studentCourses.models.map((item) => {
            const course = item.course;

            course.attrs.typeName = course.type.name;
            course.attrs.schedule = course.schedule;
            course.attrs.teacherName = course.teacher.name;

            return course;
          });
        } else if (permission === 2) {
          const teacher = schema.teachers.findBy({ email: user.email });

          data = schema.courses
            .all()
            .models.filter((item) => +item.teacherId === +teacher.id)
            .map((course) => {
              course.attrs.typeName = course.type.name;
              course.attrs.schedule = course.schedule;
              course.attrs.teacherName = course.teacher.name;

              return course;
            });
        } else if (permission === 9) {
          return new Response(403, {}, { msg: 'Permission denied', code: 403, data });
        }

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/student/interest', (schema, req) => {
        const source = schema.studentProfiles.all().models.map((item) => item.interest);
        const data = uniq(source.flat());

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      /* --------------------------------course api----------------------------------------- */

      this.get('/courses', (schema, req) => {
        const permission = getPermission(req);
        const { page, limit, userId, ...others } = req.queryParams;
        const conditions = Object.entries(others).filter(
          ([key, value]) => !!value && key !== 'own'
        );
        const filterData = (courses, sourceKey) => {
          if (page && limit) {
            courses = courses.slice((page - 1) * limit, page * limit);
          }

          if (conditions.length) {
            courses = courses.filter((item) =>
              conditions.every(([key, value]) => {
                item = sourceKey ? item[sourceKey] : item;
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
          return courses;
        };
        const getAllCourses = () => {
          let courses = schema.courses.all().models;
          const total = courses.length;

          courses = filterData(courses);

          courses.forEach((item) => {
            item.attrs.teacherName = item.teacher.name;
            item.attrs.typeName = item.type.name;
          });

          return { courses, total };
        };
        const getStudentOwnCourses = () => {
          const user = schema.users.find(userId);
          let courses = schema.students
            .findBy({ email: user.email })
            .studentCourses.models.map((item) => {
              item.attrs.course = item.course;
              item.attrs.course.attrs.typeName = item.course.type.name;

              return item;
            });

          return { total: courses.length, courses: filterData(courses, 'course') };
        };
        let data = null;

        if (permission === 1) {
          const { own } = req.queryParams;

          data = own ? getStudentOwnCourses() : getAllCourses();
        }

        if (permission === 2) {
          const user = schema.users.find(userId);
          const teacher = schema.teachers.findBy({ email: user.email });
          const courses = schema.courses.where({ teacherId: teacher.id }).models;

          courses.forEach((item) => {
            item.attrs.teacherName = item.teacher.name;
            item.attrs.typeName = item.type.name;
          });

          data = { total: courses.length, courses: filterData(courses) };
        }

        if (permission === 9) {
          data = getAllCourses();
        }

        if (data) {
          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(500, {}, { msg: 'server error', code: 500 });
        }
      });

      this.get('/course', (schema, req) => {
        const id = req.queryParams.id;
        const course = schema.courses.findBy({ id });

        course.attrs.teacherName = course.teacher.name;
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

      this.delete('/course', (schema, req) => {
        const id = +req.queryParams.id;

        schema.courses.find(id).destroy();

        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
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

      /* -------------------------------------teacher api---------------------------------- */

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
        data.attrs.courses = courses;

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

      this.delete('/teacher', (schema, req) => {
        const id = +req.queryParams.id;

        schema.teachers.find(id).destroy();

        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      /* -----------------------------------statistics api--------------------------------- */

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
        const { userId } = req.queryParams;
        const permission = getPermission(req);
        let data = null;

        if (permission === 9) {
          const source = schema.students.all().models;

          data = {
            country: getStatisticList(countBy(source, 'country')),
            typeName: getStatisticList(countBy(source, (item) => item.type.name)),
            courses: getStatisticList(
              source.reduce((acc, item) => {
                const courses = item.studentCourses.models.map((item) => item.course.name);
                const accumulate = accumulateFactory(acc);

                courses.forEach(accumulate);
                return acc;
              }, {})
            ),
            ctime: getCtimeStatistics(source),
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
        } else if (permission === 1) {
          const user = schema.users.find(userId);
          const student = schema.students.findBy({ email: user.email });
          const ownCourses = student.studentCourses.models.map((item) => {
            item.attrs.course = item.course;

            return item;
          });
          const interest = student.profile.interest;
          const interestCourses = schema.courses
            .all()
            .models.filter(
              (item) =>
                interest.includes(item.type.name) && !student.studentCourseIds.includes(item.id)
            );

          data = {
            own: { amount: ownCourses.length, name: 'own', courses: ownCourses },
            recommend: {
              amount: interestCourses.length,
              name: 'interest',
              courses: interestCourses.map((item) => {
                item.attrs.teacherName = item.teacher.name;
                item.attrs.typeName = item.type.name;

                return item;
              }),
            },
          };
        } else if (permission === 2) {
          const source = schema.courses.where({ teacherId: +userId }).models;
          const coursesIds = source.map((item) => +item.id);
          const students = schema.students
            .all()
            .models.filter(
              (student) => !!intersection(student.studentCourseIds, coursesIds).length
            );

          data = {
            total: students.length,
            // TODO:  lastMonthAdded 逻辑上是不对的，应该取上月购买了当前课程的学生数量
            lastMonthAdded: students.filter((item) =>
              isSameMonth(new Date(item.ctime), subMonths(new Date(), 1))
            ).length,
          };
        }

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/statistics/teacher', (schema, req) => {
        const { userId } = req.queryParams;
        const permission = getPermission(req);
        let data = null;

        if (permission === 9) {
          const source = schema.teachers.all().models;

          data = {
            country: getStatisticList(countBy(source, 'country')),
            skills: source.reduce((acc, cur) => {
              cur.skills.forEach((skill) => {
                const { name, level } = skill;

                if (acc.hasOwnProperty(name)) {
                  const target = acc[name].find((item) => item.level === level);

                  if (target) {
                    target.amount = target.amount + 1;
                  } else {
                    acc[name].push({ name: 'level', level, amount: 1 });
                  }
                } else {
                  acc[name] = [{ name: 'level', level, amount: 1 }];
                }
              });
              return acc;
            }, {}),
            workExperience: source.map((teacher) => {
              const workingYears = getDuration(teacher.profile.workExperience);

              return workingYears;
            }),
            ctime: getCtimeStatistics(source),
          };
        } else if (permission === 2) {
          const source = schema.courses.where({ teacherId: +userId }).models;

          data = getCourseStatistics(source);
          data.status = getStatisticList(countBy(source, (item) => item.status));
        } else if (permission === 1) {
          return new Response(403, {}, { msg: 'Permission denied!', code: 403, data });
        }

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/statistics/course', (schema, req) => {
        const source = schema.courses.all().models;
        const data = getCourseStatistics(source);

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      /* --------------------------------- other api--------------------------------------------*/
      this.get('/profile', (schema, req) => {
        const { userId, role } = req.queryParams;
        const permission = getPermission(req, role);
        const user = schema.users.find(userId);
        const target = { email: user.email };
        let data = null;

        if (permission === 1) {
          const student = schema.students.findBy(target);

          data = student.profile;
          data.attrs.name = student.name;
          data.attrs.country = student.country;
        } else if (permission === 2) {
          const teacher = schema.teachers.findBy(target);

          data = teacher.profile;
          data.attrs.name = teacher.name;
          data.attrs.country = teacher.country;
          data.attrs.skills = teacher.skills;
          data.attrs.email = teacher.email;
          data.attrs.phone = teacher.phone;
        } else {
          // TODO: manager profile
        }

        if (!!data) {
          data.attrs.email = user.email;
        }

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.post('/profile', (schema, req) => {
        const { userId, ...info } = JSON.parse(req.requestBody);
        const permission = getPermission(req);
        const user = schema.users.find(userId);
        const target = { email: user.email };
        let data = null;

        if (permission === 1) {
          // !粗爆点，更新所有的字段，管它有没有
          const student = schema.students.findBy(target).update(info);
          const profile = schema.studentProfiles.findBy(target).update(info);

          profile.attrs.name = student.name;
          profile.attrs.country = student.country;
          data = profile;
        } else if (permission === 2) {
          const teacher = schema.teachers.findBy(target).update(info);
          const profile = teacher.profile.update(info);

          profile.attrs.name = teacher.name;
          profile.attrs.country = teacher.country;
          profile.attrs.skills = teacher.skills;
          profile.attrs.email = teacher.email;
          profile.attrs.phone = teacher.phone;
          data = profile;
        } else {
          // TODO: manager profile
        }

        if (!!data) {
          data.attrs.email = user.email;
        }

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/degrees', (schema) => {
        const data = schema.degrees.all().models;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      this.get('/countries', (schema) => {
        const data = schema.countries.all().models;

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

function getDuration(data, key = 'startEnd') {
  const dates = data.map((item) => item[key].split(' ')).flat();
  const { max, min } = dates.reduce(
    (acc, cur) => {
      const date = new Date(cur).getTime();
      const { max, min } = acc;

      return { max: date > max ? date : max, min: date < min ? date : min };
    },
    { max: new Date().getTime(), min: new Date().getTime() }
  );

  return formatDistance(new Date(min), new Date(max));
}

function getCtimeStatistics(source) {
  return getStatisticList(
    countBy(source, (item) => {
      const index = item.ctime.lastIndexOf('-');

      return item.ctime.slice(0, index);
    })
  );
}

/**
 * 1: student 2: teacher 9: manger
 */
function getPermission(req, role) {
  const token = req.requestHeaders?.Authorization;
  const permission = role || token?.split('~')[1];

  switch (permission) {
    case 'student':
      return 1;
    case 'teacher':
      return 2;
    case 'manager':
      return 9;
    default:
      return 0;
  }
}

/**
 * @function getCourseStatistics
 * @param {Course[]} source - course collections
 */
function getCourseStatistics(source) {
  return {
    typeName: getStatisticList(countBy(source, (item) => item.type.name)),
    ctime: getCtimeStatistics(source),
    classTime: Object.entries(
      groupBy(
        source.map((course) => {
          const classTime = course.schedule.classTime;
          const typeName = course.type.name;

          return { classTime, typeName, name: course.name };
        }),
        (item) => item.typeName
      )
    ).map(([name, values]) => ({
      name,
      amount: values.length,
      courses: values,
    })),
  };
}
