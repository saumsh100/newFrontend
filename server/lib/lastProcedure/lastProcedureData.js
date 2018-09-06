
const DEFAULT_NUM_HOURS_NEAR_DATE = 16;

/**
 * lastProcedureData is used to store the important arguments and attributes
 * that belong to each type of lastProcedure job that is run
 */
export default {
  lastHygiene: {
    procedureAttr: 'lastHygieneDate',
    procedureApptAttr: 'lastHygieneApptId',
    cronDateName: 'CRON_LAST_HYGIENE',
    procedureCodesName: 'HYGIENE_PROCEDURE_CODES',
    numHoursNearDate: DEFAULT_NUM_HOURS_NEAR_DATE,
  },

  lastRecall: {
    procedureAttr: 'lastRecallDate',
    procedureApptAttr: 'lastRecallApptId',
    cronDateName: 'CRON_LAST_RECALL',
    procedureCodesName: 'RECALL_PROCEDURE_CODES',
    numHoursNearDate: DEFAULT_NUM_HOURS_NEAR_DATE,
  },

  lastRestorative: {
    procedureAttr: 'lastRestorativeDate',
    procedureApptAttr: 'lastRestorativeApptId',
    cronDateName: 'CRON_LAST_RESTORATIVE',
    procedureCodesName: 'RESTORATIVE_PROCEDURE_CODES',
    numHoursNearDate: DEFAULT_NUM_HOURS_NEAR_DATE,
  },
};
