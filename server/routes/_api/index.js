
import { Router } from 'express';
import { sequelizeAuthMiddleware } from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';
import chairsRouter from './chair';

const apiRouter = Router();

apiRouter.all('*', sequelizeAuthMiddleware, createJoinObject);
apiRouter.use('/chairs', chairsRouter);

export default apiRouter;
