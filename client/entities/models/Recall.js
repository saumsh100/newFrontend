import createModel from '../createModel';

const RecallSchema = {
  id: null,
  accountId: null,
  primaryType: null,
  lengthSeconds: null,
};

export default class Recall extends createModel(RecallSchema) {

}
