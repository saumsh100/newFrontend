
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import accountsRouter from './accounts';
import chairsRouter from './chairs';
import enterprisesRouter from './enterprises';
import familiesRouter from './families';
import remindersRouter from './reminders';
import permissionsRouter from './permissions';
import usersRouter from './users';
import waitSpotsRouter from './waitSpots';
import weeklySchedulesRouter from './weeklySchedules';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/enterprises', enterprisesRouter);
apiRouter.use('/families', familiesRouter);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/accounts', permissionsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/waitSpots', waitSpotsRouter);
apiRouter.use('/weeklySchedules', weeklySchedulesRouter);

export default apiRouter;
