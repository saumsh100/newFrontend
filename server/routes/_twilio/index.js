
import { Router } from 'express';
import voiceRouter from './voice';
import smsRouter from './sms';
import setupRouter from './setup';

const twilioRouterSequelize = Router();

// Set up automated Call interaction
twilioRouterSequelize.use('/voice', voiceRouter);
twilioRouterSequelize.use('/sms', smsRouter);
twilioRouterSequelize.use('/setup', setupRouter);

export default twilioRouterSequelize;
