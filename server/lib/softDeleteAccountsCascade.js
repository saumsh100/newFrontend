import sequelize from 'sequelize';
import {
  Account,
  Practitioner,
  PractitionerRecurringTimeOff,
  WeeklySchedule,
} from '../_models';

export default async function softDeleteCascade(accountId) {
  return sequelize.transaction(async (t) => {
      try {

        // This part deletes all the practitioner data for an account

        const practitioners = await Practitioner.findAll({
          where: {
            accountId,
          },
        }, { transaction: t });

        for (let i = 0; i < practitioners.length; i += 1) {
          await PractitionerRecurringTimeOff.destroy({
            where: {
              practitionerId: practitioners[i].id,
            },
          }, { transaction: t });

          await WeeklySchedule.destroy({
            where: {
              id: practitioners[i].weeklyScheduleId,
            },
          }, { transaction: t });
        }


      } catch (e) {
        console.log(e);
        t.rollback();
      }

  })
}
