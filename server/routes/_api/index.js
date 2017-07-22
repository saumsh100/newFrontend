
import { Router } from 'express';
import chairsRouter from './chair';

const apiRouter = Router();

// apiRouter.all('*', authMiddleware, createJoinObject);
apiRouter.use('/chairs', chairsRouter);

export default apiRouter;
