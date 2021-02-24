
import createModel from '../createModel';

const ReviewSchema = {
  id: null,
  accountId: null,
  patientUserId: null,
  patientId: null,
  practitionerId: null,
  stars: null,
  description: null,
};

export default class Review extends createModel(ReviewSchema, 'Review') {}
