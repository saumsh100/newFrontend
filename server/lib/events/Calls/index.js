import { namespaces } from '../../../config/globals';

const {
  Call,
  Patient,
} = require('../../../_models');
const normalize = require('../../../routes/_api/normalize');

function sendCallerIdSocket(sub, io) {
  sub.on('data', (data) => {
    Call.findOne({
      where: { id: data },
      include: [
        {
          model: Patient,
          as: 'patient',
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


export default function createCallsSub(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. call.created and call.deleted
  const subStarted = context.socket('SUB', { routing: 'topic' });

  subStarted.setEncoding('utf8');
  subStarted.connect('events', 'call.started');

  sendCallerIdSocket(subStarted, io);
}
