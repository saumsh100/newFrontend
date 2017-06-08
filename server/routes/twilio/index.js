
import { Router } from 'express';
import voiceRouter from './voice';
import smsRouter from './sms';

const twilioRouter = Router();

// Set up automated Call interaction
twilioRouter.use('/voice', voiceRouter);
twilioRouter.use('/sms', smsRouter);

export default twilioRouter;
