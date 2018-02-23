
import { namespaces } from '../../../config/globals';
import { Request, PatientUser, Patient, Event } from '../../../_models';
import normalize from '../../../routes/_api/normalize';

function sendRequestIdSocket(sub, io) {
  sub.on('data', (data) => {
    Request.findOne({
      where: { id: data },
      include: [
        {
          model: PatientUser,
          as: 'patientUser',
        },
      ],
      raw: true,
      nest: true,
    })
    .then((request) => {
      return io.of(namespaces.dash).in(request.accountId).emit('request.created', normalize('request', request));
    })
    .catch(err => console.log(err));
  });
}

export default function registerRequestsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCreated = context.socket('SUB', { routing: 'topic' });

  subCreated.setEncoding('utf8');
  subCreated.connect('events', 'request.created');

  sendRequestIdSocket(subCreated, io);
}
