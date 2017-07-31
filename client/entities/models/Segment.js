import createModel from '../createModel';

const SegmentSchema = {
  id: null,
  name: null,
  description: null,
  referenceId: null,
  reference: null,
  lengthSeconds: null,
  rawWhere: null,
};

export default class Reminder extends createModel(SegmentSchema) {

}
