
import createModel from '../createModel';

const RecallSchema = {
  id: null,
  accountId: null,
  primaryType: null,
  primaryTypes: null,
  lengthSeconds: null,
  interval: null,
  isActive: null,
  isDeleted: null,
};

export default class Recall extends createModel(RecallSchema, 'Recall') {}
