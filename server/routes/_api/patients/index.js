import { Router } from 'express';
import { Patient as PatientModel, Segment as SegmentModel, Account as AccountModel } from '../../../_models/index';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../../api/normalize';
const StatusError = require('../../../util/StatusError');

const patientsNew = Router();

// patientsNew.param('segmentId', sequelizeLoader('segment', 'Segment'));

// Get single segment info
patientsNew.get('/list-all', checkPermissions('segments:read'), async (req, res, next) => {
  const { segmentId, startDate, endDate } = req.query;
  try {
    // @TODO add ability to apply date to the segment where clause for patients
    // @TODO add ability to apply segment to the filter of the patients
    let where = {
      status: PatientModel.STATUS.ACTIVE,
    };

    let segmentData = null;
    if (segmentId) {
      segmentData = await SegmentModel.findById(segmentId);

      // if segment is null throw error
      if (!segmentData) {
        throw new StatusError(StatusError.BAD_REQUEST, `Data for Segment with id: ${segmentId} do not exists`);
      }

      // confirm if user has sent segment he has access to use
      segmentData.isOwner(req);


      where = [...where, ...segmentData.where];
    }

    // get list of all accounts for specific enterprise
    const accounts = AccountModel.findAll({
      raw: true,
      where: {
        enterpriseId: req.enterpriseId,
        include: [
          {
            raw: true,
            model: PatientModel,
            as: 'patients',
            where,
          },
        ],
      },
    });

    const activePatients = [];
    accounts.reduce((final, item) => final.concat(item.patient), activePatients);

    const dashboardData = {
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            clinics: accounts,
            totals: {
              activePatients,
              // hygienePatients: totalHygienePatients,
              // newPatients: totalNewPatients,
            },
          },
        },
      },
    };


    return res.send(dashboardData);
  } catch (error) {
    return next(error);
  }
});

export default patientsNew;
