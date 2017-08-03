import { Router } from 'express';
import {
  Patient as PatientModel,
  Segment as SegmentModel,
  Account as AccountModel,
  Appointment as AppointmentModel,
  Practitioner as PractitionerModel,
  sequelize,
} from '../../../_models/index';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../../api/normalize';
const StatusError = require('../../../util/StatusError');

const patientsNew = Router();

// patientsNew.param('segmentId', sequelizeLoader('segment', 'Segment'));

// Get single segment info
patientsNew.get('/dashboard-new', checkPermissions('segments:read'), async (req, res, next) => {
  const { segmentId, startDate, endDate } = req.query;
  try {
    if (!startDate || !endDate) {
      throw new StatusError(StatusError.BAD_REQUEST, 'Missing start and end time');
    }
    const attributes = ['Patient.id', 'Patient.accountId', [sequelize.fn('count', sequelize.col('Patient.id')), 'patientCount']];

    // fetch all enterprise accounts
    const accounts = AccountModel.findAll({
      raw: true,
      where: {
        enterpriseId: req.enterpriseId,
      },
    });
    const accountIds = [];
    const clinics = {};
    accounts.forEach((account) => {
      accountIds.push(account.id);
      clinics[account.id] = account;
    });

    const baseWhere = {
      accountId: accountIds,
    };

    // Set date where condition
    const dateWhere = {
      createdAt: {
        $between: [startDate, endDate],
      },
    };

    const activeWhere = {
      status: PatientModel.STATUS.ACTIVE,
    };

    let segmentWhere = null;
    if (segmentId) {
      const segment = await SegmentModel.findById(segmentId);

      // if segment is null throw error
      if (!segment) {
        throw new StatusError(StatusError.BAD_REQUEST, `Data for Segment with id: ${segmentId} do not exists`);
      }
      // confirm if user has sent segment he has access to use
      segment.isOwner(req);

      segmentWhere = segment.where || {};
    }
    const activePatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere };
    const activePatientsData = await PatientModel.findAll({
      attributes,
      where: {
        activePatientsWhere,
      },
      group: ['Patient.accountId'],
    });

    // fetch new patients (E.g. created at between start/end date)
    const newPatientsWhere = { ...baseWhere, ...activeWhere, ...segmentWhere, ...dateWhere };
    const newPatientsData = await PatientModel.findAll({
      attributes,
      where: {
        newPatientsWhere,
      },
      group: ['Patient.accountId'],
    });

    const hygienePatients = await PatientModel.findAll({
      attributes,
      where: {
        activePatientsWhere,
      },
      include: [
        {
          model: AppointmentModel,
          as: 'appointments',
          required: true,
          include: [
            {
              model: PractitionerModel,
              as: 'practitioner',
              required: true,
              where: {
                type: PractitionerModel.TYPE.HYGIENIST,
              },
            },
          ],
        },
      ],
      group: ['Patient.accountId'],
    });

    activePatientsData.forEach((clinic) => {
      clinics[clinic.accountId].activePatients = clinic.patientCount;
    });

    hygienePatients.forEach((clinic) => {
      clinics[clinic.accountId].hygienePatients = clinic.patientCount;
    });

    newPatientsData.forEach((clinic) => {
      clinics[clinic.accountId].newPatients = clinic.patientCount;
    });

    const dashboardData = {
      entities: {
        enterpriseDashboard: {
          patients: {
            id: 'patients',
            clinics: accounts,
            totals: {
              activePatients: activePatientsData.length,
              hygienePatients: hygienePatients.length,
              newPatients: newPatientsData.length,
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
