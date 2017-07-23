/**
 * Created by gavin on 2017-07-18.
 */
const testEnterprise1Id = '8805a729-e0d0-447c-b1bf-aa1cdfcbe0f5';
const testAccount1Id = '7a046392-3c49-4268-953b-9163ae4291f5';
const testWeeklySchedule1Id = '4b93e373-9303-4088-b974-4210192e5254';

export default [
  {
    id: testAccount1Id,
    name: 'Test Account',
    street: 'Boulevard of Broken Dreams',
    country: 'CA',
    state: 'BC',
    city: 'Vancouver',
    zipCode: 'V4C8J1',
    vendastaId: '9999999',
    timeInterval: 1,
    timezone: '+1',
    twilioPhoneNumber: '6049873432',
    destinationPhoneNumber: '6049896293',
    phoneNumber: '7789493945',
    contactEmail: 'test+accnt@carecru.com',
    website: 'test.com',
    logo: '',
    clinicName: 'Harvy Dent(ist)',
    bookingWidgetPrimaryColor: '',
    weeklyScheduleId: testWeeklySchedule1Id,
    enterpriseId: testEnterprise1Id,
    canSendReminders: false,
    canSendRecalls: false,
    unit: 15,
  },
];
