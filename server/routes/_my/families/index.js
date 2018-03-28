
import { Router } from 'express';
import { PatientUser, PatientUserFamilies } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { sequelizeLoader } from '../../util/loaders';

const familiesRouter = Router();

familiesRouter.param('familyId', sequelizeLoader('family', 'PatientUserFamily'));
familiesRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));

/**
 * POST /:familyId/patients
 *
 * - 201 sends down the created patientUser data
 * - 404 :familyId does not exist
 * - 403 only family head can add patientUsers to family
 */
familiesRouter.post('/:familyId/patients', async (req, res, next) => {
  try {
    const { patientUserId, family, body } = req;
    if (patientUserId !== family.headId) {
      throw new StatusError(403, `only family head can add patientUsers to family`);
    }

    const data = Object.assign({}, body, { patientUserFamilyId: family.id });
    const patientUser = await PatientUser.create(data);
    res.status(201).send(patientUser.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /:familyId/patients
 *
 * - 200 sends all patientUsers in family
 * - 404 :familyId does not exist
 * - 403 only family head can get patientUsers in its family
 */
familiesRouter.get('/:familyId/patients', async (req, res, next) => {
  try {
    const { patientUserId, family, body } = req;
    if (patientUserId !== family.headId) {
      throw new StatusError(403, `only family head can get patientUsers in its family`);
    }

    const patientUsers = await PatientUser.findAll({
      attributes: { exclude: ['password'] },
      where: { patientUserFamilyId: family.id },
    });

    res.send(patientUsers);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /:familyId/patients/:patientUserId
 *
 * - 200 sends all patientUsers in family
 * - 404 :familyId does not exist
 * - 403 only family head can edit patientUsers in its family
 */
familiesRouter.put('/:familyId/patients/:patientUserId', async (req, res, next) => {
  try {
    const { patientUserId, family, patientUser, body } = req;
    if (patientUserId !== family.headId) {
      throw new StatusError(403, `only family head can edit patientUsers in its family`);
    }

    if (patientUser.patientUserFamilyId !== family.id) {
      throw new StatusError(403, `this patient user does not belong to this family`);
    }

    const newPatientUser = req.patientUser.update(body);
    res.send(newPatientUser.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

export default familiesRouter;
