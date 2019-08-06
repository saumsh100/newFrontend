
import createModel from '../createModel';

const PatientTimelineEventSchema = {
  id: null,
  accountId: null,
  patientId: null,
  type: null,
  action: null,
  metaData: null,
};

export default class PatientTimelineEvent extends createModel(PatientTimelineEventSchema) {}
