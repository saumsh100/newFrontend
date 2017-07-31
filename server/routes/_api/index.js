
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import chairsRouter from './chairs';
import familiesRouter from './families';
import remindersRouter from './reminders';
import permissionsRouter from './permissions';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/families', familiesRouter);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/accounts', permissionsRouter);

export default apiRouter;
