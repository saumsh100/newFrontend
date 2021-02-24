
import createModel from '../createModel';

const SentReviewSchema = {
  id: null,
  accountId: null,
  stars: null,
  description: null,
  patientId: null,
  practitionerId: null,
  appointmentId: null,
  reviewId: null,
  isSent: null,
  isCompleted: null,
  primaryType: null,
};

export default class SentReview extends createModel(SentReviewSchema, 'SentReview') {}
