export default function({ ccId: patientId }, context, userId, accountId) {
  return {
    patientId,
    userId,
    context,
    accountId,
  };
}
