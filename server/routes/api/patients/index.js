
const _ = require('lodash');
const patientsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const Patient = require('../../../models/Patient');

// TODO: this should have default queries and limits
patientsRouter.get('/', checkPermissions('patients:read'), (req, res, next) => {
  const {
    accountId,
    joinObject,
  } = req;

  // TODO: remove patientsList check
  // TODO: this code breaks server if there is no patientsList
  if (req.query.patientsList === 'true') {
    Patient.filter({ accountId }).getJoin(joinObject).run()
      .then((patients) => {
        console.log('patients', patients);

        if (req.query.patientName && req.query.patientName.length) {
          const pattern = new RegExp(req.query.patientName, 'i');
          patients = patients.filter(p =>
            pattern.test(`${p.firstName} ${p.lastName}`)
          );
        }
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
          tempPatient.lastAppointmentDate = !_.isEmpty(patientAppointments[0]) ?
            patientAppointments[0].startTime : 'No next appointment';

          tempPatient.nextAppointmentTitle = !_.isEmpty(patientAppointments[0]) ?
            patientAppointments[0].title : 'No next appointment';

          tempPatient.name = `${p.firstName} ${p.lastName}`;
          tempPatient.birthday = p.birthday;
          tempPatient.gender = p.gender;
          tempPatient.patientId = p.id;
          tempPatient.language = p.language;
          tempPatient.status = p.status;
          tempPatient.photo = `https://randomuser.me/api/portraits/men/${Math.floor((Math.random() * 80) + 1)}.jpg`;
          tempPatient.id = p.id;

          if (p.insurance) {
            tempPatient.insurance = p.insurance;
          }

          if (p.middleName) {
            tempPatient.middleName = p.middleName;
          }

          results[p.id] = tempPatient;
          console.log("tempPatient");
          console.log(tempPatient);
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
  }).then(patient => res.send(normalize('patient', patient)))
    .catch(next);
});

patientsRouter.get('/:patientId', (req, res, next) => {
  const { patientId } = req.params;
  Patient.get(patientId)
    .then(patient => res.send(normalize('patient', patient)))
    .catch(next);
});

patientsRouter.put('/:patientId', (req, res, next) => {
  const data = {};
  switch (req.body.title) {
    case "personal":
      data.firstName = req.body.firstName;
      data.lastName = req.body.lastName;
      data.phoneNumber = req.body.phoneNumber;
      data.email = req.body.email;
      data.gender = req.body.gender;
      data.language = req.body.language;
      data.birthday = req.body.birthday;
      data.status = req.body.status;
      data.middleName = req.body.middleName;
    break;

    case "insurance":
      data.insurance = {
        insurance: req.body.insurance,
        memberId: req.body.memberId,
        contract: req.body.contract,
        carrier: req.body.carrier,
        sin: req.body.sin,
      }

    break;
  }

  const { patientId } = req.params;
  Patient.get(patientId).run().then((p) => {
    p.merge(data).save().then((patient) => {
      res.send(normalize('patient', patient));
    });
  })
    .catch(next);
});

patientsRouter.delete('/:patientId', (req, res, next) => {
  const { patientId } = req.params;
  Patient.get(patientId).then((patient) => {
    patient.delete().then((result) => {
      // TODO: send down?
      res.send();
    });
  })
    .catch(next);
});

module.exports = patientsRouter;
