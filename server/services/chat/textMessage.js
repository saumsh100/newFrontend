
import { Op } from 'sequelize';
import { setDateToTimezone } from '../../util/time';
import logger from '../../config/logger';
import { Account, TextMessage, User } from '../../_models';
import { sendSMS } from '../sms';
import { createChat, updateLastMessageData } from './chat';

export async function createTextMessage(message, patient, userId, chatId) {
  try {
    const account = await Account.findById(patient.accountId, { raw: true });
    const sms = {
      body: message,
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
    };
    const twilioMessage = await sendSMS(sms);

    if (!chatId) {
      const newChat = {
        accountId: patient.accountId,
        patientId: patient.id,
        patientPhoneNumber: patient.mobilePhoneNumber,
      };

      const chatInstance = await createChat(newChat);
      chatId = chatInstance.id;
    }

    const textMessage = {
      id: twilioMessage.sid,
      body: message,
      chatId,
      userId,
      to: patient.mobilePhoneNumber,
      from: account.twilioPhoneNumber,
      read: true,
    };

    const textMessageInstance = await TextMessage.create(textMessage);
    await updateLastMessageData(chatId, textMessage.id, new Date());
    return textMessageInstance.get({ plain: true });
  } catch (exception) {
    logger.error(exception.message);
    throw Error(exception);
  }
}

export async function markMessagesAsUnread(chatId, textMessageCreatedAt, twilioNumber) {
  try {
    await TextMessage.update(
      { read: false },
      {
        where: {
          chatId,
          to: twilioNumber,
          createdAt: {
            [Op.gte]: setDateToTimezone(textMessageCreatedAt, 'America/Vancouver').toDate(),
          },
        },
      },
    );

    return TextMessage.findAll({
      raw: true,
      nest: true,
      where: { chatId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: 'password',
          },
          required: false,
        },
      ],
    });
  } catch (exception) {
    logger.error(exception);
    throw Error(exception);
  }
}

export async function markMessagesAsRead(chatId) {
  try {
    await TextMessage.update(
      { read: true },
      {
        where: {
          chatId,
          read: false,
        },
      },
    );

    return TextMessage.findAll({
      raw: true,
      nest: true,
      where: { chatId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: {
            exclude: 'password',
          },
          required: false,
        },
      ],
    });
  } catch (exception) {
    logger.error(exception);
    throw Error(exception);
  }
}
