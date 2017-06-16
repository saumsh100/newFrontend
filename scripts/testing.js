const { type } = require('../server/config/thinky');
const createModel = require('./../server/models/createModel/index');

const Teacher = createModel('Teacher', {
  name: type.string(),
});

const Student = createModel('Student', {
  name: type.string(),
});

Teacher.hasAndBelongsToMany(Student, 'students', 'id', 'id');
Student.hasAndBelongsToMany(Teacher, 'teachers', 'id', 'id');

const teacherA = new Teacher({
  name: 'A',
});

const teacherB = new Teacher({
  name: 'B',
});

const student1 = new Student({
  name: '1',
});

const student2 = new Student({
  name: '2',
});

console.log('teacherA.id', teacherA.id);

Promise.all([
  // Now create in DB
  teacherA.save(),
  teacherB.save(),
  student1.save(),
  student2.save(),

]).then(([tA, tB, s1, s2]) => {
  // These are created docs in the DB, time to add relations and play around
  console.log('teacherA', tA);
  console.log('teacherB', tB);
  console.log('student1', s1);
  console.log('student2', s2);

  // This creates a document in Student_Teacher table
  tA.students = [student1.id];
  tA.saveAll({ students: true })
    .then((teacherAWithStudent1) => {
      console.log('teacherAWithStudent1', teacherAWithStudent1);
      const teacherAId = teacherA.id;
      const student1Id = student1.id;

      // notice how the teacher doc in the DB has no info on student
      Teacher.get(teacherAId)
        .then((teacherDoc) => {
          console.log('teacherDoc', teacherDoc);

          // now remove student and see what happens...
          Student.get(student1Id).getJoin({ teachers: true })
            .then((studentWithTeachers) => {
              // student1 should have teacherA in teachers []
              console.log('studentWithTeachers', studentWithTeachers);


              // re-fetch the teacher with students
              Teacher.get(teacherAId).getJoin({ students: true })
                .then((newTeacherDocWithStudents) => {
                  // Notice that the student is removed!
                  newTeacherDocWithStudents.students = [];
                  newTeacherDocWithStudents.saveAll({ students: true })
                    .then((teacherRemoved) => {
                      console.log('teacherWithStudentsRemoved', teacherRemoved);

                      Student.get(student1Id).getJoin({ teachers: true })
                        .then((studentRemoved) => {
                          console.log('studentWithTeachersRemoved', studentRemoved);
                        });
                    });
                });
            });

        });
    });
});
