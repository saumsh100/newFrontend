
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { formatPhoneNumber } from '@carecru/isomorphic';
import * as LegacyTemplates from './templates/legacy';
import FamilyReminders from './templates/FamilyReminders/FamilyReminders';
import { shouldUseLegacyTemplate } from '../reminders/reminderTemplate/util';
import { getMessageFromTemplates } from '../../services/communicationTemplate';
import { NUM_DAYS_DEFAULT } from '../../config/globals';

export default async function renderTemplates(props) {
  const { templateName, account, confirmType } = props;

  const devMode = false;
  const color =
    devMode || !account.bookingWidgetPrimaryColor
      ? '#206477'
      : account.bookingWidgetPrimaryColor;
  const maxWidth = 600;

  const templateProps = {
    defaultColor: '#206477',
    color,
    maxWidth,
    title: '',
    devMode,
    lang: 'en',
    ...props,
  };

  const accountNumber = formatPhoneNumber(account.phoneNumber);
  if (await shouldUseLegacyTemplate(account)) {
    const footerMessage = `If you need to reschedule your appointment, please call ${accountNumber}. Note, there may be a fee for cancellations or reschedules within ${NUM_DAYS_DEFAULT} business days of an appointment.`;

    const Template =
      LegacyTemplates[getFamilyLegacyTemplates(templateName, confirmType)];

    return renderAndReplace(Template, {
      ...templateProps,
      footerMessage,
    });
  }

  const emailTemplates = await getEmailTemplates(templateName, props);
  const footerMessage = await getMessageFromTemplates(
    account.id,
    'reminder-email-final-message',
    {
      numDays: NUM_DAYS_DEFAULT,
      phoneNumber: accountNumber,
    },
  );

  return renderAndReplace(FamilyReminders, {
    ...templateProps,
    ...emailTemplates,
    footerMessage,
    isConfirmed: confirmType === 'confirmed',
  });
}

/**
 * gets the legacy family reminder templates map
 * @param templateName
 * @param confirmType
 * @return {*}
 */
function getFamilyLegacyTemplates(templateName, confirmType) {
  const componentName = {
    single: {
      unconfirmed: 'FamilyRemindersForAnotherSingle',
      confirmed: 'FamilyRemindersForAnotherSingleConfirmed',
    },
    multiple: {
      unconfirmed: 'FamilyRemindersForAnotherMultiple',
      confirmed: 'FamilyRemindersForAnotherMultipleConfirmed',
    },
    self: {
      unconfirmed: 'FamilyRemindersForSelfAndOthers',
      confirmed: 'FamilyRemindersForSelfAndOthersConfirmed',
    },
  };

  return componentName[templateName][confirmType];
}

/**
 *
 * @param templateName
 * @param props
 * @return {{actionHeader: Promise<string>, subHeader: Promise<string>}}
 */
async function getEmailTemplates(templateName, props) {
  const {
    account,
    appointmentDate,
    patient,
    familyMembers,
    confirmType,
  } = props;
  const [familyMember] = familyMembers;

  const confirmedString = confirmType === 'confirmed' ? 'confirmed-' : '';

  // builds action-header
  const actionHeaderSuffix = `${confirmedString}action-header`;
  const actionHeaderTemplateName = getTemplateName(
    templateName,
    actionHeaderSuffix,
  );

  const actionHeaderTemplateValue = {
    date: appointmentDate,
    familyMember,
  };

  const actionHeader = await getMessageFromTemplates(
    account.id,
    actionHeaderTemplateName,
    actionHeaderTemplateValue,
  );

  // builds sub-header
  const subHeaderSuffix = `${confirmedString}sub-header`;
  const subHeaderTemplateName = getTemplateName(templateName, subHeaderSuffix);
  const subHeaderTemplateValue = {
    familyHead: { firstName: patient.firstName },
    familyMember,
  };

  const subHeader = await getMessageFromTemplates(
    account.id,
    subHeaderTemplateName,
    subHeaderTemplateValue,
  );

  return {
    actionHeader,
    subHeader,
  };
}

/**
 * Generates the correct temaplate name for the template API
 * @param preffix
 * @param suffix
 * @return {string}
 */
function getTemplateName(preffix, suffix) {
  return `reminder-email-${preffix}-${suffix}`;
}

/**
 * Call react static render and replace encoded characters
 * @param Component
 * @param props
 * @return {*}
 */
function renderAndReplace(Component, props) {
  // eslint-disable-next-line react/jsx-filename-extension
  return renderToStaticMarkup(<Component {...props} />)
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
