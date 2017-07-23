import { Router } from 'express';
import { Segment as SegmentModel } from '../../../_models/index';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../../api/normalize';

const segmentRouter = Router();

segmentRouter.param('segmentId', sequelizeLoader('segment', 'Segment'));

// Get single segment info
segmentRouter.get('/:type/:segmentId', checkPermissions('segments:read'), async (req, res, next) => {
  const { type, segmentId } = req.params;
  try {
    // return single segment info
    const segment = await SegmentModel.findOne({
      where: {
        accountId: req.accountId,
        id: segmentId,
        type,
      },
    });
    return res.send(normalize('segment', segment));
  } catch (error) {
    return next(error);
  }
});

// Get all segments for specific type (E.g. patients)
segmentRouter.get('/:type', checkPermissions('segments:read'), async (req, res, next) => {
  const { type } = req.params;
  try {
    // return single segment info
    const segments = await SegmentModel.findAll({
      where: {
        accountId: req.accountId,
        type,
      },
    });
    return res.send(normalize('segments', segments));
  } catch (error) {
    return next(error);
  }
});

// Create segment.
segmentRouter.post('/:type', checkPermissions('segments:create'), async (req, res, next) => {
  const { type } = req.params;
  const data = req.body;
  try {
    data.type = type;
    data.accountId = req.accountId;
    const segment = await SegmentModel.create(data);
    return res.send(normalize('segment', segment));
  } catch (error) {
    return next(error);
  }
});

// Update segment.
segmentRouter.put('/:type/:segmentId', checkPermissions('segments:update'), async (req, res, next) => {
  const { segmentId } = req.params;
  const data = req.body;

  // Note: type isn't used, but in future there might be some usage
  try {
    if (data.type) {
      // user cannot change his segment type
      delete data.type;
    }
    const segment = await SegmentModel.update(data, {
      where: {
        id: segmentId,
        accountId: req.accountId,
      },
    });
    return res.send(normalize('segment', segment));
  } catch (error) {
    return next(error);
  }
});

// Delete segment
segmentRouter.delete('/:type/:segmentId', checkPermissions('segments:delete'), async (req, res, next) => {
  const { segmentId } = req.params;
  // Note: type isn't used, but in future there might be some usage
  try {
    const segment = await SegmentModel.destroy({
      where: {
        id: segmentId,
        accountId: req.accountId,
      },
    });
    return res.send(normalize('segment', segment));
  } catch (error) {
    return next(error);
  }
});

export default segmentRouter;
