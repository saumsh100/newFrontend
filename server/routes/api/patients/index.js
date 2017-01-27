
const { normalize, Schema, arrayOf } = require('normalizr');
const patientsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const Patient = require('../../../models/Patient');
const _ = require('lodash');

const patientSchema = new Schema('patients');
/* patientsRouter.param('patientId', (req, res, next, patientId) => {
  User.find(id, function(err, user) {
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});*/

// TODO: this should have default queries and limits
patientsRouter.get('/', /* checkPermissions('patients:read'), */ (req, res, next) => {
  // TODO: ensure that we only pull patients for activeAccount
  if (req.query.patientsList === 'true') {
    Patient.filter({ accountId: req.query.accountId }).getJoin({
      textMessages: false, appointments: true,
    }).run()
      .then((patients) => {
        const appointments = patients.map(p => p.appointments);
        const sortedAppointments = appointments.map(arr1 =>
          arr1.filter(a =>
            new Date().getTime() <= new Date(a.startTime).getTime()
          ).sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          )
        );
        const results = {};
        const flatten = _.flatten(sortedAppointments);
        const patientsIds = [];
        patients.forEach((p) => {
          patientsIds.push(p.id);
          const tempPatient = {};
          const patientAppointments = flatten.filter(a => a.patientId === p.id);

          // console.log(patientAppointments);
          tempPatient.nextAppointmentTime = !_.isEmpty(patientAppointments[0]) ?
           patientAppointments[0].startTime : 'No next appointment';

          tempPatient.nextAppointmentTitle = !_.isEmpty(patientAppointments[0]) ?
           patientAppointments[0].title : 'No next appointment';

          tempPatient.name = `${p.firstName} ${p.lastName}`;
          tempPatient.age = p.age || 20;

          results[p.id] = tempPatient;
        });

        const resultStructure = {
          entities: { patientList: results },
          results: patientsIds,
        };

        return res.send(resultStructure);
      })
      .catch(next);
  }
  /* Patient.run()
    .then(patients => res.send(normalize(patients, arrayOf(patientSchema))))
    .catch(next); */
});

patientsRouter.post('/', (req, res, next) => {
  const { firstName, lastName, phoneNumber, email } = req.body;
  Patient.save({
    firstName,
    lastName,
    phoneNumber,
  })
  .then(patient => res.send(normalize(patient, patientSchema)))
  .catch(next);
});

patientsRouter.get('/:patientId', (req, res, next) => {
  const { patientId } = req.params;
  Patient.get(patientId)
    .then(patient => res.send(normalize(patient, patientSchema)))
    .catch(next);
});

patientsRouter.put('/:patientId', (req, res, next) => {
  const data = {};
  data.firstName = req.body.firstName;
  data.lastName = req.body.lastName;
  data.phoneNumber = req.body.phoneNumber;
  data.email = req.body.email;
  const { patientId } = req.params;
  Patient.get(patientId).run().then((p) => {
    p.merge(data).save().then((patient) => {
      res.send(normalize(patient, patientSchema));
    });
  })
  .catch(next);
});

patientsRouter.delete('/:patientId', (req, res, next) => {
  const { patientId } = req.params;
  Patient.get(patientId).then((patient) => {
    patient.delete().then((result) => {
      res.send(normalize(result, patientSchema));
    });
  })
  .catch(next);
});

module.exports = patientsRouter;
