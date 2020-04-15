
import Patient from '../../../../../entities/models/Patient';

export const waitSpots = [
  {
    clientId: '12345',
    id: 'waitspot_id_1',
    accountViewerClientId: 'account_id_1',
    patient: new Patient({
      firstName: 'John',
      lastName: 'Wick',
      cellPhoneNumber: '1111111111',
    }),
  },
  {
    clientId: '12345',
    id: 'waitspot_id_2',
    accountViewerClientId: 'account_id_2',
    patient: new Patient({
      firstName: 'John2',
      lastName: 'Wick2',
      cellPhoneNumber: '2222222222',
    }),
  },
  {
    clientId: '12345',
    id: 'waitspot_id_3',
    accountViewerClientId: 'account_id_3',
    patient: new Patient({
      firstName: 'John3',
      lastName: 'Wick3',
    }),
  },
];

export const mockResponse = {
  success: [
    new Patient({
      firstName: 'John2',
      lastName: 'Wick2',
      cellPhoneNumber: '2222222222',
    }),
    new Patient({
      firstName: 'John3',
      lastName: 'Wick3',
    }),
  ],
  errors: [
    new Patient({
      firstName: 'John',
      lastName: 'Wick',
      cellPhoneNumber: '1111111111',
    }),
  ],
};
export default waitSpots;
