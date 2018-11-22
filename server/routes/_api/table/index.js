
import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import PatientQuery, { patientQueryBuilder } from '../../../lib/patientsQuery/index';

const tableRouter = new Router({});

/**
 * Fetching patients for patients table.
 *
 */
tableRouter.get('/', checkPermissions('table:read'), async (req, res, next) => {
  try {
    const patients = await PatientQuery(Object.assign(req.query, { accountId: req.accountId }));
    return res.send(normalize('patients', patients));
  } catch (error) {
    return next(error);
  }
});

tableRouter.get(
  '/search',
  checkPermissions('table:read'),
  async (req, res, next) => {
    try {
      const parsedQuery = Object.entries(req.query).reduce((query, [key, value]) => {
        let parsedValue;
        try {
          parsedValue = JSON.parse(value.trim());
        } catch (e) {
          throw new Error('Malformed query parameter, values should be JSON compliant');
        }

        query[key] = parsedValue;
        return query;
      }, {});

      const patients = await patientQueryBuilder({
        ...parsedQuery,
        accountId: req.accountId,
      });

      const countObj = {
        id: 'totalPatients',
        count: patients.count.length > 1 ? patients.count.length : patients.count,
      };

      const patientsToNormalize = [
        ...patients.rows,
        {
          ...countObj,
          get: () => countObj,
        },
      ];

      return res.send(normalize('patients', patientsToNormalize.map(p => p.get({ plain: true }))));
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = tableRouter;
