
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

export default class Segment extends createModel(SegmentSchema, 'Segment') {}
