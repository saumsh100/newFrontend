
import { Router } from 'express';
import accountsRouter from './accounts';
import appointmentRouter from './appointment';
import reputationRouter from './reputation';
import patientsRouter from './patients';
import familyRouter from './family';
import practitionersRouter from './practitioners';
import requestRouter from './request';
import userRouter from './users';
import textMessagesRouter from './textMessages';
import chairsRouter from './chair';
import chatsRouter from './chats';
import servicesRouter from './services';
import availabilitiesRouter from './availabilities';
import syncErrorRouter from './syncClientError';
import timeOffsRouter from './practitionerTimeOffs';
import updaterRouter from './updater';
import waitSpotsRouter from './waitSpots';
import weeklySchedulesRouter from './weeklySchedules';
import enterprisesRouter from './enterprises';
import authMiddleware from '../../middleware/auth';
import createJoinObject from '../../middleware/createJoinObject';

const apiRouter = Router();

apiRouter.all('*', authMiddleware, createJoinObject);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/reputation', reputationRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/families', familyRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/chats', chatsRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/practitioners', practitionersRouter);
apiRouter.use('/textMessages', textMessagesRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/availabilities', availabilitiesRouter);
apiRouter.use('/syncClientError', syncErrorRouter);
apiRouter.use('/timeOffs', timeOffsRouter);
apiRouter.use('/waitSpots', waitSpotsRouter);
apiRouter.use('/weeklySchedules', weeklySchedulesRouter);
apiRouter.use('/updater', updaterRouter);
apiRouter.use('/enterprises', enterprisesRouter);

export default apiRouter;
