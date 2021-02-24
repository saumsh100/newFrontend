
import createModel from '../createModel';

const CallSchema = {
  id: null,
  accountId: null,
  patientId: null,
  dateTime: null,
  answered: null,
  voicemail: null,
  wasApptBooked: null,
  direction: null,
  duration: null,
  priorCalls: null,
  recording: null,
  recordingDuration: null,
  startTime: null,
  totalCalls: null,
  callerCity: null,
  callerCountry: null,
  callerName: null,
  callerNum: null,
  callerZip: null,
  callerState: null,
  campaign: null,
  destinationNum: null,
  trackingNum: null,
  callSource: null,
};

export default class Call extends createModel(CallSchema, 'Call') {
  getUrlRoot() {
    return `/api/calls/${this.get('id')}`;
  }
}
