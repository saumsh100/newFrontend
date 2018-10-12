
import { generateInsights } from './patientInformation';

const earliestDate = '2017-04-10T00:00:00.000Z';
describe('Patient Information', () => {
  describe('#generateInsights', () => {
    it('calls getPatientFromCellPhoneNumber when mobile number is provided', async () => {
      const insightsBuilder = [
        {
          get: () => ({
            id: '1010',
            appointments: [{
              id: 2020,
              isPatientConfirmed: true,
            }],
            family: {
              patients: [
                {
                  firstName: 'b',
                  dueForRecallExamDate: earliestDate,
                  dueForHygieneDate: '2017-10-10T00:00:00.000Z',
                },
                {
                  firstName: 'a',
                  dueForHygieneDate: earliestDate,
                },
              ],
            },
          }),
        }, {
          get: () => ({
            id: '1111',
            cellPhoneNumber: null,
            email: '1111@1111.com',
            appointments: [{
              id: 2222,
              isPatientConfirmed: true,
            }],
          }),
        },
        {
          get: () => ({
            id: '1212',
            cellPhoneNumber: '1212',
            appointments: [{
              id: 2424,
              isPatientConfirmed: true,
            }],
          }),
        },
        {
          get: () => ({
            id: '1313',
            cellPhoneNumber: '1313',
            email: 'email@email.com',
            appointments: [{
              id: 2424,
              isPatientConfirmed: true,
            }],
          }),
        },
      ];
      const insights = await generateInsights(insightsBuilder, '2018-10-10T00:00:00.000Z');
      expect(insights).toHaveLength(3);
      expect(insights[0].insights).toHaveLength(3);
      expect(insights[0].insights[0].type).toBe('missingMobilePhone');
      expect(insights[0].insights[1].type).toBe('missingEmail');
      expect(insights[0].insights[2].type).toBe('familiesDueRecare');
      expect(insights[0].insights[2].value).toHaveLength(2);
      expect(insights[0].insights[2].value[0].dateDue).toBe(earliestDate);
      expect(insights[1].insights[0].type).toBe('missingMobilePhone');
      expect(insights[2].insights[0].type).toBe('missingEmail');
    });
  });
});
