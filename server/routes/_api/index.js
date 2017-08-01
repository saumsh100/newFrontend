
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import accountsRouter from './accounts';
import chairsRouter from './chairs';
import enterprisesRouter from './enterprises';
import familiesRouter from './families';
import remindersRouter from './reminders';
import usersRouter from './users';
import waitSpotsRouter from './waitSpots';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/enterprises', enterprisesRouter);
apiRouter.use('/families', familiesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/waitSpots', waitSpotsRouter);

export default apiRouter;
