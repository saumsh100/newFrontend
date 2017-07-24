const segmentRouter = require('express').Router();
const SegmentModel = require('../../../_models/').Segment;

segmentRouter.get('/', async (req, res, next) => {
  try {
    // Find all segments existing on system. Temporary for showing functionality
    const segments = await SegmentModel.findAll();
    res.send(segments);
  } catch (error) {
    next(error);
  }
});

module.exports = segmentRouter;
