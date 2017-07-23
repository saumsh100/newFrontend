
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import chairsRouter from './chair';
import segmentsRouter from './segment';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/segments', segmentsRouter);

export default apiRouter;
