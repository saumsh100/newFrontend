
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import chairsRouter from './chairs';
import familiesRouter from './families';
import segmentsRouter from './segments';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/segments', segmentsRouter);
apiRouter.use('/families', familiesRouter);

export default apiRouter;
