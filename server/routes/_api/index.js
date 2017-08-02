
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import accountsRouter from './accounts';
import chairsRouter from './chairs';
import enterprisesRouter from './enterprises';
import familiesRouter from './families';
import remindersRouter from './reminders';
import practitionersRouter from './practitioners';
import permissionsRouter from './permissions';
import usersRouter from './users';
import waitSpotsRouter from './waitSpots';
import sentRemindersRouter from './sentReminders';
import sentRecallsRouter from './sentRecalls';
import requestRouter from './request';
import updaterRouter from './updater';
import weeklySchedulesRouter from './weeklySchedules';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/enterprises', enterprisesRouter);
apiRouter.use('/families', familiesRouter);
apiRouter.use('/practitioners', practitionersRouter);
apiRouter.use('/accounts', permissionsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/waitSpots', waitSpotsRouter);
apiRouter.use('/sentReminders', sentRemindersRouter);
apiRouter.use('/sentRecalls', sentRecallsRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/updater', updaterRouter);
apiRouter.use('/weeklySchedules', weeklySchedulesRouter);

export default apiRouter;
