
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import chairsRouter from './chairs';
import enterprisesRouter from './enterprises';
import familiesRouter from './families';
import remindersRouter from './reminders';
import practitionersRouter from './practitioners';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/enterprises', enterprisesRouter);
apiRouter.use('/families', familiesRouter);
apiRouter.use('/practitioners', practitionersRouter);

export default apiRouter;
