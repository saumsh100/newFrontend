
import createModel from '../createModel';

const EventsSchema = {
  id: null,
  pmsId: null,
  description: null,
  accountId: null,
  practitionerId: null,
  chairId: null,
  note: null,
  startDate: null,
  endDate: null,
  pmsCreatedAt: null,
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  event: true,
};

export default class Events extends createModel(EventsSchema) {}
