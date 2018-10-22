
import { Router } from 'express';
import { sequelizeLoader } from '../util/loaders';
import { createAccount, updateAccount, deleteAccount, addListings, disableListings, addReputationManagement, disableReputationManagement, updateProductIds } from '../../lib/thirdPartyIntergrations/vendasta';
import normalize from '../_api/normalize';
import { sequelizeAuthMiddleware } from '../../middleware/auth';

const vendastaRouterSequelize = Router();
vendastaRouterSequelize.all('*', sequelizeAuthMiddleware);
vendastaRouterSequelize.param('accountId', sequelizeLoader('account', 'Account'));

/** POST /:accountId
 * Create Vendasta account for a carecru account
 */
vendastaRouterSequelize.post('/:accountId', async ({ account }, res, next) => {
  try {
    const updatedAccount = await createAccount(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** PUT /:accountId
 * Update Vendasta account for a carecru account
 *
 */
vendastaRouterSequelize.put('/:accountId', async ({ account }, res, next) => {
  try {
    const updatedAccount = await updateAccount(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** DELETE /:accountId
 * Delete Vendasta account for a carecru account
 *
 */
vendastaRouterSequelize.delete('/:accountId', async ({ account }, res, next) => {
  try {
    const updatedAccount = await deleteAccount(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** POST /:accountId/listings
 * Enable listings feature for a carecru account
 *
 */
vendastaRouterSequelize.post('/:accountId/listings', async ({ account }, res, next) => {
  try {
    await addListings(account);
    return res.send(normalize('account', account.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** DELETE /:accountId/listings
 * Disable listings feature for a carecru account
 *
 */
vendastaRouterSequelize.delete('/:accountId/listings', async ({ account }, res, next) => {
  try {
    await disableListings(account);
    return res.send(normalize('account', account.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** POST /:accountId/reviews
 * Enable reputation management (reviews) for a carecru account
 *
 */
vendastaRouterSequelize.post('/:accountId/reviews', async ({ account }, res, next) => {
  try {
    await addReputationManagement(account);
    return res.send(normalize('account', account.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** DELETE /:accountId/reviews
 * Disable reputation management (reviews) for a carecru account
 *
 */
vendastaRouterSequelize.delete('/:accountId/reviews', async ({ account }, res, next) => {
  try {
    await disableReputationManagement(account);
    return res.send(normalize('account', account.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

/** PATCH /:accountId/productIds
 * Update the Listings/Reviews Ids in the carecru account.
 *
 */
vendastaRouterSequelize.patch('/:accountId/productIds', async ({ account }, res, next) => {
  try {
    const updatedAccount = await updateProductIds(account);
    return res.send(normalize('account', updatedAccount.get({ plain: true })));
  } catch (e) {
    next(e);
  }
});

module.exports = vendastaRouterSequelize;
