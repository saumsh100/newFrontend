
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import chairsRouter from './chairs';
import familiesRouter from './families';
import remindersRouter from './reminders';
import waitSpotsRouter from './waitSpots';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/families', familiesRouter);
apiRouter.use('/accounts', remindersRouter);
apiRouter.use('/waitSpots', waitSpotsRouter);

export default apiRouter;
