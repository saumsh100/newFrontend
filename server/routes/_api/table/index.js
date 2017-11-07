
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { PatientQuery } from '../../../lib/patients/patientQuery';

const tableRouter = new Router();

/**
 * Fetching patients for patients table.
 *
 */
tableRouter.get('/', checkPermissions('table:read'), async (req, res, next) => {
  try {
    const patients = await PatientQuery(Object.assign(req.query, { accountId: req.accountId }));
    return res.send(normalize('patients', patients));
  } catch (error) {
    next(error);
  }
});

module.exports = tableRouter;
