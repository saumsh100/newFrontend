
import { Router } from 'express';
import voiceRouter from './voice';
import smsRouter from './sms';

const twilioRouterSequelize = Router();

// Set up automated Call interaction
twilioRouterSequelize.use('/voice', voiceRouter);
twilioRouterSequelize.use('/sms', smsRouter);

export default twilioRouterSequelize;
