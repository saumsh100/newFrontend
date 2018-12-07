
import { Router } from 'express';
import normalize from '../normalize';
import checkPermissions from '../../../middleware/checkPermissions';
import patientQueryBuilder from '../../../lib/patientsQuery';

const tableRouter = new Router({});
const malformedError =
  new Error('Malformed order[] query parameter, values should be JSON compliant');

tableRouter.get(
  '/search',
  checkPermissions('table:read'),
  async ({ query, accountId }, res, next) => {
    if (query.order && !Array.isArray(query.order)) {
      return next(Error('Order query parameter should be an array. eg: order[]'));
    }

    try {
      const parsedOrderQuery = query.order && query.order.reduce((orderQuery, value) => {
        let parsedValue;

        if (value.length < 1) {
          throw new Error('Order cannot be empty');
        }

        try {
          parsedValue = JSON.parse(value.trim());
        } catch (e) {
          throw malformedError;
        }

        if (!Array.isArray(parsedValue) && typeof parsedValue !== 'string') {
          throw new Error('Order value should be array or string');
        }

        if (parsedValue.length < 1) {
          throw malformedError;
        }

        orderQuery = [...orderQuery, parsedValue];
        return orderQuery;
      }, []);

      const patients = await patientQueryBuilder({
        ...query,
        order: parsedOrderQuery,
        accountId,
      });

      const countObj = {
        id: 'totalPatients',
        count: Array.isArray(patients.count) ? patients.count.length : patients.count,
      };

      const patientsToNormalize = [
        ...patients.rows,
        {
          ...countObj,
          get: () => countObj,
        },
      ];

      return res.send(normalize('patients', patientsToNormalize.map((p, i) => ({
        ...p.get({ plain: true }),
        rowNumber: (query.page * query.limit) + i + 1,
      }))));
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = tableRouter;
