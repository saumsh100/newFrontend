import { namespaces } from '../../../config/globals';
import { Call, Patient } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

function sendCallerIdSocket(sub, io) {
  sub.on('data', (data) => {
    Call.findOne({
      where: { id: data },
      include: [
        {
          model: Patient,
          as: 'patient',
          required: false,
        },
      ],

      raw: true,
      nest: true,
    })
    .then((call) => {
      if (call.patient.id === null) {
        delete call.patient;
      }
      return io.of(namespaces.dash).in(call.accountId).emit('call.started', normalize('call', call));
    })
    .catch(err => console.log(err));
  });
}

function sendCallerIdSocketEnded(sub, io) {
  sub.on('data', (data) => {
    Call.findOne({
      where: { id: data },
      include: [
        {
          model: Patient,
          as: 'patient',
          required: false,
        },
      ],

      raw: true,
      nest: true,
    })
    .then((call) => {
      if (call.patient.id === null) {
        delete call.patient;
      }

      return io.of(namespaces.dash).in(call.accountId).emit('call.ended', normalize('call', call));
    })
    .catch(err => console.log(err));
  });
}

export function fetchCallEvents(patientId) {
  return Call.findAll({
    raw: true,
    where: {
      patientId,
    },
    order: [['createdAt', 'ASC']],
  });
}

export default function registerCallsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. call.created and call.ended
  const subStarted = context.socket('SUB', { routing: 'topic' });
  const subEnded = context.socket('SUB', { routing: 'topic' });

  subStarted.setEncoding('utf8');
  subStarted.connect('events', 'call.started');
  subEnded.setEncoding('utf8');
  subEnded.connect('events', 'call.ended');

  sendCallerIdSocket(subStarted, io);
  sendCallerIdSocketEnded(subEnded, io);
}
