
import createModel from '../createModel';

const AccountSchema = {
  id: null,
  addressId: null,
  name: null,
  street: null,
  logo: null,
  fullLogoUrl: null,
  country: null,
  state: null,
  city: null,
  timeInterval: null,
  zipCode: null,
  vendastaId: null,
  phoneNumber: null,
  timezone: null,
  contactEmail: null,
  website: null,
  twilioPhoneNumber: null,
  bookingWidgetPrimaryColor: null,
  destinationPhoneNumber: null,
  enterpriseId: null,
  weeklyScheduleId: null, // new OfficeHoursRecord(),
  unit: null,
  canSendReminders: null,
  canSendRecalls: null,
  canSendReviews: null,
  lastSyncDate: new Date(2016, 5, 1).toISOString(),
  googlePlaceId: null,
  facebookUrl: null,
  vendastaMsId: null,
  sendRequestEmail: null,
  vendastaAccountId: null,
  vendastaSrId: null,
  callrailId: null,
  recallInterval: null,
  hygieneInterval: null,
  recallBuffer: null,
  recallStartTime: null,
  recallEndTime: null,
  reviewsInterval: null,
  massOnlineEmailSentDate: null,
  suggestedChairId: null,
  sendUnconfirmedReviews: null,
  omitChairIds: [],
  omitPractitionerIds: [],
};

export default class Account extends createModel(AccountSchema) {
  getUrlRoot() {
    return `/api/accounts/${this.getId()}`;
  }
}
