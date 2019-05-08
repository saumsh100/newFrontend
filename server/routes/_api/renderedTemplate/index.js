import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import { getMessageFromTemplates } from '../../../services/communicationTemplate';

const renderedTemplateRouter = new Router();

renderedTemplateRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * Get rendered template
 */
renderedTemplateRouter.get(
  '/:accountId/renderedTemplate',
  checkPermissions('accounts:read'),
  async ({ account, query: { templateName, parameters } }, res, next) => {
    try {
      const renderedMessage = await getMessageFromTemplates(account.id, templateName, parameters);
      return res.send(renderedMessage);
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = renderedTemplateRouter;
