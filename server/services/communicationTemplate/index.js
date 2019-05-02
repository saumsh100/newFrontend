
import { AccountTemplate, Template } from 'CareCruModels';
import replace from 'lodash/replace';
import get from 'lodash/get';

/**
 * Get the compiled template message.
 * @param accountId
 * @param templateName
 * @param parameters
 * @return {Promise<string>}
 */
export async function getMessageFromTemplates(accountId, templateName, parameters = {}) {
  const accountTemplate = await findAccountTemplate(accountId, templateName);
  if (!accountTemplate) return null;
  const paramsList = validateParameters(accountTemplate.get('template').values, parameters);
  return composeMessage(accountTemplate.get('value'), paramsList);
}

/**
 * Validates the parameters list. Use only those parameters that exists in the template.
 * @param templateParams
 * @param givenParams
 */
export function validateParameters(templateParams, givenParams) {
  const finalList = {};
  for (const param in templateParams) {
    if (get(givenParams, param)) {
      finalList[param] = get(givenParams, param);
    }
  }
  return finalList;
}

/**
 * Find the correct account template based on accountId and templateId.
 * @param accountId
 * @param templateId
 * @return {Promise<AccountTemplate>}
 */
export async function findAccountTemplate(accountId, templateName) {
  const accountsTemplate = await AccountTemplate.findAll({
    where: {
      $or: [
        { accountId },
        { accountId: null },
      ],
    },
    include: [
      {
        model: Template,
        as: 'template',
        required: true,
        where: { templateName },
      },
    ],
  });

  return extractCorrectTemplate(accountId, accountsTemplate);
}

/**
 * Extract account specific template or return the default one
 * @param accountId
 * @param templates
 * @return {AccountTemplate}
 */
export function extractCorrectTemplate(accountId, templates = []) {
  const accountTemplate = templates.find(template => template.get('accountId') === accountId);
  const defaultTemplate = templates.find(template => !template.get('accountId'));

  return accountTemplate || defaultTemplate;
}

/**
 * Compose a message based on parameters and template given.
 * @param templateString
 * @param params
 * @return {*}
 */
export function composeMessage(templateString, params = {}) {
  let compiledMessage = templateString;
  for (const param in params) {
    const regex = new RegExp(`\\$\\{${param}\\}`, 'g');
    compiledMessage = replace(compiledMessage, regex, params[param]);
  }
  return compiledMessage;
}
