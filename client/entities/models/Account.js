import createModel from '../createModel';

const AccountSchema = {
  id: null,
  addressId: null,
  autoRespondOutsideOfficeHoursLimit: null,
  canAutoRespondOutsideOfficeHours: false,
  bufferBeforeOpening: null,
  bufferAfterClosing: null,
  name: null,
  street: null,
  isAddressUpdate: null,
  logo: null,
  fullLogoUrl: null,
  country: null,
  state: null,
  city: null,
  cellPhoneNumberFallback: null,
  timeInterval: null,
  zipCode: null,
  vendastaId: null,
  phoneNumber: null,
  timezone: null,
  contactEmail: null,
  website: null,
  twilioPhoneNumber: null,
  bookingWidgetPrimaryColor: null,
  bookingWidgetButtonLabel: null,
  destinationPhoneNumber: null,
  enterpriseId: null,
  externalId: null,
  weeklyScheduleId: null, // new OfficeHoursRecord(),
  unit: null,
  canSendReminders: null,
  canSendRecalls: null,
  canSendReviews: null,
  cancellationListTimeFrame: null,
  lastSyncDate: new Date(2016, 5, 1).toISOString(),
  googlePlaceId: null,
  facebookUrl: null,
  instagramUrl: null,
  vendastaMsId: null,
  sendRequestEmail: null,
  vendastaAccountId: null,
  vendastaSrId: null,
  callrailId: null,
  callrailIdV3: null,
  recallInterval: null,
  hygieneInterval: null,
  recallBuffer: null,
  recallStartTime: null,
  recallEndTime: null,
  reviewsInterval: null,
  reviewsChannels: null,
  massOnlineEmailSentDate: null,
  suggestedChairId: null,
  sendUnconfirmedReviews: null,
  lastReviewInterval: null,
  lastSentReviewInterval: null,
  isChairSchedulingEnabled: null,
  omitChairIds: [],
  omitPractitionerIds: [],
  displayNameOption: null,
  notificationEmails: [],
  useNotificationEmails: false,
  onlineBookingUrl: null,
  canSendRemindersToInactivePatients: null,
  useRecallWithoutOnlineBooking: null,
  vendastaSrIdEnabled: null,
  vendastaMsIdEnabled: null,
};

export default class Account extends createModel(AccountSchema, 'Account') {
  getUrlRoot() {
    return `/api/accounts/${this.getId()}`;
  }
}
