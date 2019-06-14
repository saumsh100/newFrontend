
/**
 * Generate the voice bin name
 * @param isConfirmable
 * @param dependants
 * @return {string}
 */
export default function getVoiceTemplateName(isConfirmable, isFamily) {
  const confirmType = isConfirmable ? 'unconfirmed' : 'confirmed';
  const familySuffix = isFamily ? '-family' : '';

  return `reminder-voice-${confirmType}${familySuffix}`;
}
