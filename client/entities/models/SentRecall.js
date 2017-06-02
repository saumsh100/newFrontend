import createModel from '../createModel';

const SentRecallSchema = {
  id: null,
  recallId: null,
  accountId: null,
  patientId: null,
  isConfirmed: null,
};

export default class SentRecall extends createModel(SentRecallSchema) {
  getUrlRoot() {
    return `/api/sentRecalls/${this.getId()}`;
  }
}
