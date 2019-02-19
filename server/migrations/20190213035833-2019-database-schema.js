
'use strict';

const procedures = require('./fixtures/procedures.json');

const { NODE_ENV } = process.env;
const devOrTestEnv = NODE_ENV === 'development' || NODE_ENV === 'test';
const skipMigrationMessage = 'Skiping schema migration on non development or test enviroment';

module.exports = {
  up: queryInterface =>
    queryInterface.sequelize.transaction(async (t) => {
      if (!devOrTestEnv) {
        console.log(skipMigrationMessage);
        return Promise.resolve();
      }

      try {
        await queryInterface.sequelize.query(
          `
create extension if not exists "uuid-ossp";

create type "enum_Enterprises_plan" as enum ('GROWTH', 'ENTERPRISE');
create type "enum_Patients_status" as enum ('Active', 'Inactive');
create type "enum_Permissions_role" as enum ('MANAGER', 'ADMIN', 'OWNER', 'SUPERADMIN');
create type "enum_Invites_role" as enum ('MANAGER', 'ADMIN', 'OWNER');
create type "enum_PractitionerRecurringTimeOffs_dayOfWeek" as enum ('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
create type "enum_Recalls_primaryType" as enum ('phone', 'email', 'sms');
create type "enum_Reminders_primaryType" as enum ('phone', 'email', 'sms');
create type "enum_Segments_reference" as enum ('enterprise', 'account');
create type "enum_SentRecalls_primaryType" as enum ('phone', 'email', 'sms');
create type "enum_SentReminders_primaryType" as enum ('phone', 'email', 'sms');
create type "enum_SyncClientErrors_operation" as enum ('create', 'update', 'delete', 'sync');
create type "enum_SentReviews_primaryType" as enum ('phone', 'email', 'sms');

create table if not exists "SequelizeMeta"
(
  name varchar(255) not null
    constraint "SequelizeMeta_pkey"
      primary key
);

create table if not exists "Enterprises"
(
  id          uuid                                                              not null
    constraint "Enterprises_pkey"
      primary key,
  name        varchar(255)                                                      not null,
  plan        "enum_Enterprises_plan" default 'GROWTH'::"enum_Enterprises_plan" not null,
  "createdAt" timestamp with time zone                                          not null,
  "updatedAt" timestamp with time zone                                          not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "WeeklySchedules"
(
  id                uuid                     not null
    constraint "WeeklySchedules_pkey"
      primary key,
  "startDate"       timestamp with time zone,
  "isAdvanced"      boolean default false,
  "weeklySchedules" jsonb[],
  "createdAt"       timestamp with time zone not null,
  "updatedAt"       timestamp with time zone not null,
  "deletedAt"       timestamp with time zone,
  "pmsId"           varchar(255),
  "mondayId"        uuid,
  "tuesdayId"       uuid,
  "wednesdayId"     uuid,
  "thursdayId"      uuid,
  "fridayId"        uuid,
  "saturdayId"      uuid,
  "sundayId"        uuid,
  "accountId"       uuid
);

create table if not exists "PatientUsers"
(
  id                       uuid                     not null
    constraint "PatientUsers_pkey"
      primary key,
  email                    varchar(255)
    constraint "PatientUsers_email_key"
      unique,
  "patientUserId"          uuid
    constraint "PatientUsers_patientUserId_fkey"
      references "PatientUsers"
      on update cascade on delete set null,
  password                 varchar(255),
  "phoneNumber"            varchar(255)
    constraint "PatientUsers_phoneNumber_key"
      unique,
  "firstName"              varchar(255)             not null,
  "lastName"               varchar(255)             not null,
  "isEmailConfirmed"       boolean default false    not null,
  "isPhoneNumberConfirmed" boolean default false    not null,
  "avatarUrl"              varchar(255),
  "createdAt"              timestamp with time zone not null,
  "updatedAt"              timestamp with time zone not null,
  "deletedAt"              timestamp with time zone,
  "patientUserFamilyId"    uuid,
  gender                   varchar(255),
  "birthDate"              timestamp with time zone,
  "insuranceCarrier"       varchar(255),
  "insuranceMemberId"      varchar(255),
  "insuranceGroupId"       varchar(255)
);

create table if not exists "Families"
(
  id             uuid                     not null
    constraint "Families_pkey"
      primary key,
  "accountId"    uuid                     not null,
  "pmsId"        varchar(255),
  "headId"       varchar(255),
  "createdAt"    timestamp with time zone not null,
  "updatedAt"    timestamp with time zone not null,
  "deletedAt"    timestamp with time zone,
  "pmsCreatedAt" timestamp with time zone,
  constraint "family_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

create table if not exists "AuthSessions"
(
  id             uuid                     not null
    constraint "AuthSessions_pkey"
      primary key,
  "modelId"      uuid                     not null,
  "accountId"    uuid,
  "enterpriseId" uuid,
  role           varchar(255),
  permissions    jsonb,
  "createdAt"    timestamp with time zone not null,
  "updatedAt"    timestamp with time zone not null,
  "deletedAt"    timestamp with time zone
);

create table if not exists "Permissions"
(
  id                     uuid                     not null
    constraint "Permissions_pkey"
      primary key,
  role                   "enum_Permissions_role"  not null,
  permissions            jsonb,
  "canAccessAllAccounts" boolean default true     not null,
  "allowedAccounts"      uuid[],
  "createdAt"            timestamp with time zone not null,
  "updatedAt"            timestamp with time zone not null,
  "deletedAt"            timestamp with time zone
);

create table if not exists "PinCodes"
(
  "pinCode"   varchar(255)             not null
    constraint "PinCodes_pkey"
      primary key,
  "modelId"   uuid                     not null,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "Segments"
(
  id            uuid                      not null
    constraint "Segments_pkey"
      primary key,
  name          varchar(255)              not null,
  description   text,
  "referenceId" uuid                      not null,
  reference     "enum_Segments_reference" not null,
  "where"       jsonb                     not null,
  "rawWhere"    jsonb                     not null,
  "createdAt"   timestamp with time zone  not null,
  "updatedAt"   timestamp with time zone  not null,
  "deletedAt"   timestamp with time zone
);

create table if not exists "SyncClientVersions"
(
  id          uuid                     not null
    constraint "SyncClientVersions_pkey"
      primary key,
  major       double precision,
  minor       double precision,
  patch       double precision,
  build       double precision,
  url         varchar(255),
  key         varchar(255),
  secret      varchar(255),
  filename    varchar(255),
  path        varchar(255),
  bucket      varchar(255),
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "PasswordResets"
(
  id          uuid                     not null
    constraint "PasswordResets_pkey"
      primary key,
  email       varchar(255)             not null,
  token       uuid,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "Addresses"
(
  id          uuid                     not null
    constraint "Addresses_pkey"
      primary key,
  street      varchar(255),
  country     varchar(255) default 'CA'::character varying,
  state       varchar(255),
  city        varchar(255),
  "zipCode"   varchar(255),
  timezone    varchar(255),
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "Accounts"
(
  id                                   uuid                                                                                                                                                              not null
    constraint "Accounts_pkey"
      primary key,
  name                                 varchar(255)                                                                                                                                                      not null,
  "createdAt"                          timestamp with time zone                                                                                                                                          not null,
  "updatedAt"                          timestamp with time zone                                                                                                                                          not null,
  "deletedAt"                          timestamp with time zone,
  "enterpriseId"                       uuid                                                                                                                                                              not null
    constraint "Accounts_enterpriseId_fkey"
      references "Enterprises"
      on update cascade,
  "EnterpriseId"                       uuid
    constraint "Accounts_EnterpriseId_fkey"
      references "Enterprises"
      on update cascade on delete set null,
  "weeklyScheduleId"                   uuid
    constraint "Accounts_weeklyScheduleId_fkey"
      references "WeeklySchedules"
      on update cascade,
  "canSendReminders"                   boolean        default false,
  "canSendRecalls"                     boolean        default false,
  unit                                 integer        default 15,
  "vendastaId"                         varchar(255),
  "timeInterval"                       integer,
  timezone                             varchar(255),
  "twilioPhoneNumber"                  varchar(255),
  "destinationPhoneNumber"             varchar(255),
  "phoneNumber"                        varchar(255),
  "contactEmail"                       varchar(255),
  website                              varchar(255),
  logo                                 varchar(255),
  "clinicName"                         varchar(255),
  "bookingWidgetPrimaryColor"          varchar(255),
  "syncClientAdapter"                  varchar(255),
  "lastSyncDate"                       timestamp with time zone,
  "addressId"                          uuid                                                                                                                                                              not null
    constraint "Accounts_addressId_fkey"
      references "Addresses"
      on update cascade on delete set null,
  "callrailId"                         integer,
  "vendastaAccountId"                  varchar(255),
  "canSendReviews"                     boolean        default false                                                                                                                                      not null,
  "googlePlaceId"                      varchar(255),
  "facebookUrl"                        varchar(255),
  "vendastaMsId"                       varchar(255),
  "vendastaSrId"                       varchar(255),
  "sendRequestEmail"                   boolean        default true                                                                                                                                       not null,
  "hygieneInterval"                    varchar(255)   default '6 months'::character varying                                                                                                              not null,
  "recallInterval"                     varchar(255)   default '6 months'::character varying                                                                                                              not null,
  "recallBuffer"                       varchar(255)   default '1 days'::character varying                                                                                                                not null,
  "recallStartTime"                    time           default '17:00:00'::time without time zone,
  "recallEndTime"                      time           default '20:00:00'::time without time zone,
  "reviewsInterval"                    varchar(255)   default '15 minutes'::character varying,
  "bumpInterval"                       varchar(255)   default '2 weeks'::character varying                                                                                                               not null,
  "massOnlineEmailSentDate"            timestamp with time zone,
  "suggestedChairId"                   uuid,
  "sendUnconfirmedReviews"             boolean        default false                                                                                                                                      not null,
  "omitChairIds"                       uuid[]         default ARRAY []::uuid[]                                                                                                                           not null,
  "omitPractitionerIds"                uuid[]         default ARRAY []::uuid[]                                                                                                                           not null,
  "cellPhoneNumberFallback"            varchar(255)[] default ARRAY ['mobilePhoneNumber'::character varying(255), 'otherPhoneNumber'::character varying(255), 'homePhoneNumber'::character varying(255)] not null,
  "canAutoRespondOutsideOfficeHours"   boolean        default false,
  "bufferBeforeOpening"                varchar(255),
  "bufferAfterClosing"                 varchar(255),
  "autoRespondOutsideOfficeHoursLimit" varchar(255),
  "isChairSchedulingEnabled"           boolean        default false                                                                                                                                      not null
);

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_accountId_fkey"
    foreign key ("accountId") references "Accounts"
      on update cascade on delete cascade;

create table if not exists "Practitioners"
(
  id                 uuid                     not null
    constraint "Practitioners_pkey"
      primary key,
  "accountId"        uuid                     not null
    constraint "Practitioners_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "pmsId"            varchar(255),
  type               varchar(255),
  "isActive"         boolean default true,
  "isHidden"         boolean default false,
  "firstName"        varchar(255),
  "lastName"         varchar(255),
  "avatarUrl"        varchar(255),
  "isCustomSchedule" boolean default false,
  "weeklyScheduleId" uuid
    constraint "Practitioners_weeklyScheduleId_fkey"
      references "WeeklySchedules"
      on update cascade,
  "createdAt"        timestamp with time zone not null,
  "updatedAt"        timestamp with time zone not null,
  "deletedAt"        timestamp with time zone,
  constraint "practitioner_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

create table if not exists "Patients"
(
  id                            uuid                                            not null
    constraint "Patients_pkey"
      primary key,
  "accountId"                   uuid                                            not null
    constraint "Patients_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "pmsId"                       varchar(255),
  "patientUserId"               uuid
    constraint "Patients_patientUserId_fkey"
      references "PatientUsers"
      on update cascade on delete cascade,
  email                         varchar(255),
  "firstName"                   varchar(255)                                    not null,
  "lastName"                    varchar(255)                                    not null,
  "middleName"                  varchar(255),
  "phoneNumber"                 varchar(255),
  "homePhoneNumber"             varchar(255),
  "mobilePhoneNumber"           varchar(255),
  "workPhoneNumber"             varchar(255),
  "otherPhoneNumber"            varchar(255),
  "prefContactPhone"            varchar(255),
  gender                        varchar(255),
  "prefName"                    varchar(255),
  language                      varchar(255),
  address                       jsonb                  default '{}'::jsonb,
  preferences                   jsonb                  default '{"sms": true, "phone": true, "evening": true, "morning": true, "recalls": true, "reviews": true, "weekdays": true, "weekends": true, "afternoon": true, "referrals": true, "reminders": true, "newsletter": true, "birthdayMessage": true, "emailNotifications": true}'::jsonb,
  type                          varchar(255),
  "birthDate"                   timestamp with time zone,
  insurance                     jsonb,
  "isDeleted"                   boolean                default false,
  "isSyncedWithPms"             boolean                default false,
  "familyId"                    uuid
    constraint "Patients_familyId_fkey"
      references "Families"
      on update cascade on delete cascade,
  status                        "enum_Patients_status" default 'Active'::"enum_Patients_status",
  "createdAt"                   timestamp with time zone                        not null,
  "updatedAt"                   timestamp with time zone                        not null,
  "deletedAt"                   timestamp with time zone,
  "pmsCreatedAt"                timestamp with time zone,
  "firstApptId"                 uuid,
  "lastApptId"                  uuid,
  "nextApptId"                  uuid,
  "firstApptDate"               timestamp with time zone,
  "lastApptDate"                timestamp with time zone,
  "nextApptDate"                timestamp with time zone,
  "lastHygieneApptId"           uuid,
  "lastHygieneDate"             timestamp with time zone,
  "insuranceInterval"           varchar(255),
  "lastRecallApptId"            uuid,
  "lastRecallDate"              timestamp with time zone,
  "lastRestorativeApptId"       uuid,
  "lastRestorativeDate"         timestamp with time zone,
  "contCareInterval"            varchar(255),
  "avatarUrl"                   varchar(255),
  "dueForRecallExamDate"        timestamp with time zone,
  "dueForHygieneDate"           timestamp with time zone,
  "contactMethodNote"           varchar(255),
  "recallPendingAppointmentId"  uuid,
  "hygienePendingAppointmentId" uuid,
  "omitReminderIds"             uuid[]                 default ARRAY []::uuid[] not null,
  "omitRecallIds"               uuid[]                 default ARRAY []::uuid[] not null,
  "cellPhoneNumber"             varchar(255),
  constraint "patient_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

create table if not exists "Services"
(
  id                    uuid                     not null
    constraint "Services_pkey"
      primary key,
  "accountId"           uuid                     not null
    constraint "Services_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  name                  varchar(255)             not null,
  "pmsId"               varchar(255),
  duration              integer                  not null,
  "bufferTime"          integer,
  "unitCost"            integer,
  "isHidden"            boolean default false,
  "isDefault"           boolean default false,
  "createdAt"           timestamp with time zone not null,
  "updatedAt"           timestamp with time zone not null,
  "deletedAt"           timestamp with time zone,
  "reasonWeeklyHoursId" uuid,
  constraint "service_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

create table if not exists "Chairs"
(
  id          uuid                     not null
    constraint "Chairs_pkey"
      primary key,
  "accountId" uuid                     not null
    constraint "Chairs_accountId_fkey"
      references "Accounts"
      on update cascade,
  description varchar(255),
  "pmsId"     varchar(255),
  name        varchar(255)             not null,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone,
  "isActive"  boolean default true,
  constraint "chair_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

alter table "Accounts"
  add constraint "Accounts_suggestedChairId_fkey"
    foreign key ("suggestedChairId") references "Chairs";

create table if not exists "Appointments"
(
  id                   uuid                     not null
    constraint "Appointments_pkey"
      primary key,
  "accountId"          uuid                     not null
    constraint "Appointments_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "practitionerId"     uuid                     not null
    constraint "Appointments_practitionerId_fkey"
      references "Practitioners"
      on update cascade,
  "patientId"          uuid
    constraint "Appointments_patientId_fkey"
      references "Patients"
      on update cascade,
  "serviceId"          uuid
    constraint "Appointments_serviceId_fkey"
      references "Services"
      on update cascade,
  "chairId"            uuid
    constraint "Appointments_chairId_fkey"
      references "Chairs"
      on update cascade,
  "pmsId"              varchar(255),
  "isDeleted"          boolean default false,
  "isBookable"         boolean default false,
  "startDate"          timestamp with time zone not null,
  "endDate"            timestamp with time zone not null,
  note                 text,
  "isReminderSent"     boolean default false    not null,
  "isPatientConfirmed" boolean default false    not null,
  "isSyncedWithPms"    boolean default false    not null,
  "isCancelled"        boolean default false    not null,
  "customBufferTime"   integer,
  "createdAt"          timestamp with time zone not null,
  "updatedAt"          timestamp with time zone not null,
  "deletedAt"          timestamp with time zone,
  "isPending"          boolean default false    not null,
  "isShortCancelled"   boolean default true     not null,
  reason               varchar(255),
  "isPreConfirmed"     boolean,
  "estimatedRevenue"   double precision,
  "isRecall"           boolean,
  "originalDate"       timestamp with time zone,
  "isMissed"           boolean default false    not null,
  constraint "appointment_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

alter table "Patients"
  add constraint "Patients_firstApptId_fkey"
    foreign key ("firstApptId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_lastApptId_fkey"
    foreign key ("lastApptId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_nextApptId_fkey"
    foreign key ("nextApptId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_lastHygieneApptId_fkey"
    foreign key ("lastHygieneApptId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_lastRecallApptId_fkey"
    foreign key ("lastRecallApptId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_lastRestorativeApptId_fkey"
    foreign key ("lastRestorativeApptId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_recallPendingAppointmentId_fkey"
    foreign key ("recallPendingAppointmentId") references "Appointments"
      on update cascade on delete set null;

alter table "Patients"
  add constraint "Patients_hygienePendingAppointmentId_fkey"
    foreign key ("hygienePendingAppointmentId") references "Appointments"
      on update cascade on delete set null;

create index if not exists appointments_start_date
  on "Appointments" ("startDate");

create index if not exists appointments_end_date
  on "Appointments" ("endDate");

create table if not exists "Calls"
(
  id                  varchar(255)             not null
    constraint "Calls_pkey"
      primary key,
  "accountId"         uuid                     not null
    constraint "Calls_accountId_fkey"
      references "Accounts"
      on update cascade,
  "patientId"         uuid
    constraint "Calls_patientId_fkey"
      references "Patients"
      on update cascade,
  "dateTime"          timestamp with time zone,
  answered            boolean,
  voicemail           boolean,
  "wasApptBooked"     boolean,
  direction           varchar(255),
  duration            integer,
  "priorCalls"        integer,
  recording           varchar(255),
  "recordingDuration" varchar(255),
  "startTime"         timestamp with time zone,
  "totalCalls"        integer,
  "callerCity"        varchar(255),
  "callerCountry"     varchar(255),
  "callerName"        varchar(255),
  "callerNum"         varchar(255),
  "callerZip"         varchar(255),
  "callerState"       varchar(255),
  campaign            varchar(255),
  "destinationNum"    varchar(255),
  "trackingNum"       varchar(255),
  "callSource"        varchar(255),
  "createdAt"         timestamp with time zone not null,
  "updatedAt"         timestamp with time zone not null,
  "deletedAt"         timestamp with time zone,
  "appointmentId"     uuid
    constraint "Calls_appointmentId_fkey"
      references "Appointments"
      on update cascade
);

create table if not exists "Chats"
(
  id                    uuid                     not null
    constraint "Chats_pkey"
      primary key,
  "accountId"           uuid                     not null
    constraint "Chats_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "patientId"           uuid
    constraint "Chats_patientId_fkey"
      references "Patients"
      on update cascade,
  "patientPhoneNumber"  varchar(255)             not null,
  "lastTextMessageDate" timestamp with time zone,
  "lastTextMessageId"   varchar(255),
  "createdAt"           timestamp with time zone not null,
  "updatedAt"           timestamp with time zone not null,
  "deletedAt"           timestamp with time zone,
  "isFlagged"           boolean default false,
  "hasUnread"           boolean default false
);

create table if not exists "Users"
(
  id                        uuid                     not null
    constraint "Users_pkey"
      primary key,
  username                  varchar(255)             not null
    constraint "Users_username_key"
      unique,
  password                  varchar(255)             not null,
  "activeAccountId"         uuid                     not null
    constraint "Users_activeAccountId_fkey"
      references "Accounts"
      on update cascade,
  "enterpriseId"            uuid                     not null
    constraint "Users_enterpriseId_fkey"
      references "Enterprises"
      on update cascade,
  "permissionId"            uuid                     not null
    constraint "Users_permissionId_fkey"
      references "Permissions"
      on update cascade,
  "firstName"               varchar(255)             not null,
  "lastName"                varchar(255)             not null,
  "avatarUrl"               varchar(255),
  "createdAt"               timestamp with time zone not null,
  "updatedAt"               timestamp with time zone not null,
  "deletedAt"               timestamp with time zone,
  "sendBookingRequestEmail" boolean default false    not null
);

create table if not exists "Invites"
(
  id              uuid                                                       not null
    constraint "Invites_pkey"
      primary key,
  "accountId"     uuid                                                       not null
    constraint "Invites_accountId_fkey"
      references "Accounts"
      on update cascade,
  "enterpriseId"  uuid                                                       not null
    constraint "Invites_enterpriseId_fkey"
      references "Enterprises"
      on update cascade,
  "sendingUserId" uuid                                                       not null
    constraint "Invites_sendingUserId_fkey"
      references "Users"
      on update cascade,
  "isDeleted"     boolean             default false,
  role            "enum_Invites_role" default 'MANAGER'::"enum_Invites_role" not null,
  email           varchar(255)                                               not null,
  token           varchar(255),
  "createdAt"     timestamp with time zone                                   not null,
  "updatedAt"     timestamp with time zone                                   not null,
  "deletedAt"     timestamp with time zone
);

create table if not exists "Practitioner_Services"
(
  id               uuid                     not null
    constraint "Practitioner_Services_pkey"
      primary key,
  "practitionerId" uuid                     not null
    constraint "Practitioner_Services_practitionerId_fkey"
      references "Practitioners"
      on update cascade on delete cascade,
  "serviceId"      uuid                     not null
    constraint "Practitioner_Services_serviceId_fkey"
      references "Services"
      on update cascade on delete cascade,
  "createdAt"      timestamp with time zone not null,
  "updatedAt"      timestamp with time zone not null,
  "deletedAt"      timestamp with time zone
);

create table if not exists "PractitionerRecurringTimeOffs"
(
  id               uuid                     not null
    constraint "PractitionerRecurringTimeOffs_pkey"
      primary key,
  "practitionerId" uuid
    constraint "PractitionerRecurringTimeOffs_practitionerId_fkey"
      references "Practitioners"
      on update cascade on delete set null,
  "startDate"      timestamp with time zone not null,
  "endDate"        timestamp with time zone not null,
  "startTime"      timestamp with time zone,
  "endTime"        timestamp with time zone,
  interval         integer,
  "allDay"         boolean default true,
  "fromPMS"        boolean default false,
  "dayOfWeek"      "enum_PractitionerRecurringTimeOffs_dayOfWeek",
  note             varchar(255),
  "createdAt"      timestamp with time zone not null,
  "updatedAt"      timestamp with time zone not null,
  "deletedAt"      timestamp with time zone,
  "pmsId"          varchar(255),
  constraint "practitioner_practitionerId_pmsId_unique"
    unique ("practitionerId", "pmsId")
);

create table if not exists "Recalls"
(
  id              uuid                         not null
    constraint "Recalls_pkey"
      primary key,
  "accountId"     uuid                         not null
    constraint "Recalls_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "primaryType"   "enum_Recalls_primaryType"   not null,
  "lengthSeconds" integer,
  "createdAt"     timestamp with time zone     not null,
  "updatedAt"     timestamp with time zone     not null,
  "deletedAt"     timestamp with time zone,
  "isActive"      boolean        default true  not null,
  "isDeleted"     boolean        default false not null,
  "primaryTypes"  varchar(255)[] default (ARRAY []::character varying[])::character varying(255)[],
  interval        varchar(255)
);

create table if not exists "Reminders"
(
  id                      uuid                                    not null
    constraint "Reminders_pkey"
      primary key,
  "accountId"             uuid                                    not null
    constraint "Reminders_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "primaryType"           "enum_Reminders_primaryType"            not null,
  "lengthSeconds"         integer,
  "createdAt"             timestamp with time zone                not null,
  "updatedAt"             timestamp with time zone                not null,
  "deletedAt"             timestamp with time zone,
  "isActive"              boolean        default true             not null,
  "isDeleted"             boolean        default false            not null,
  "primaryTypes"          varchar(255)[] default (ARRAY []::character varying[])::character varying(255)[],
  interval                varchar(255),
  "isCustomConfirm"       boolean        default false            not null,
  "customConfirmData"     json,
  "isConfirmable"         boolean        default true             not null,
  "omitPractitionerIds"   uuid[]         default ARRAY []::uuid[] not null,
  "ignoreSendIfConfirmed" boolean        default false            not null,
  "isDaily"               boolean        default false            not null,
  "dailyRunTime"          time,
  "dontSendWhenClosed"    boolean        default false            not null,
  "omitChairIds"          uuid[]         default ARRAY []::uuid[] not null,
  "startTime"             time
);

create table if not exists "Requests"
(
  id                        uuid                     not null
    constraint "Requests_pkey"
      primary key,
  "accountId"               uuid                     not null
    constraint "Requests_accountId_fkey"
      references "Accounts"
      on update cascade,
  "patientUserId"           uuid                     not null
    constraint "Requests_patientUserId_fkey"
      references "PatientUsers"
      on update cascade,
  "serviceId"               uuid                     not null
    constraint "Requests_serviceId_fkey"
      references "Services"
      on update cascade,
  "practitionerId"          uuid
    constraint "Requests_practitionerId_fkey"
      references "Practitioners"
      on update cascade on delete cascade,
  "chairId"                 uuid
    constraint "Requests_chairId_fkey"
      references "Chairs"
      on update cascade,
  "startDate"               timestamp with time zone not null,
  "endDate"                 timestamp with time zone not null,
  note                      varchar(255),
  "isConfirmed"             boolean default false    not null,
  "isCancelled"             boolean default false    not null,
  "appointmentId"           uuid
    constraint "Requests_appointmentId_fkey"
      references "Appointments"
      on update cascade,
  "createdAt"               timestamp with time zone not null,
  "updatedAt"               timestamp with time zone not null,
  "deletedAt"               timestamp with time zone,
  "suggestedPractitionerId" uuid
    constraint "Requests_suggestedPractitionerId_fkey"
      references "Practitioners"
      on update cascade on delete set null,
  "suggestedChairId"        uuid
    constraint "Requests_suggestedChairId_fkey"
      references "Chairs"
      on update cascade on delete set null,
  "pmsId"                   varchar(255),
  "isSyncedWithPms"         boolean default false    not null,
  "patientId"               uuid
    constraint "Requests_patientId_fkey"
      references "Patients",
  "insuranceCarrier"        varchar(255),
  "insuranceMemberId"       varchar(255),
  "sentRecallId"            varchar(255),
  "requestingPatientUserId" uuid
    constraint "Requests_requestingPatientUserId_fkey"
      references "PatientUsers"
      on update cascade,
  "insuranceGroupId"        varchar(255),
  constraint "request_accountId_pmsId_unique"
    unique ("accountId", "pmsId")
);

create table if not exists "SentRecalls"
(
  id              uuid                           not null
    constraint "SentRecalls_pkey"
      primary key,
  "accountId"     uuid                           not null
    constraint "SentRecalls_accountId_fkey"
      references "Accounts"
      on update cascade,
  "recallId"      uuid                           not null
    constraint "SentRecalls_recallId_fkey"
      references "Recalls"
      on update cascade,
  "patientId"     uuid                           not null
    constraint "SentRecalls_patientId_fkey"
      references "Patients"
      on update cascade on delete cascade,
  "isSent"        boolean default false          not null,
  "primaryType"   "enum_SentRecalls_primaryType" not null,
  "lengthSeconds" integer,
  "createdAt"     timestamp with time zone       not null,
  "updatedAt"     timestamp with time zone       not null,
  "deletedAt"     timestamp with time zone,
  "errorCode"     varchar(255),
  interval        varchar(255),
  "isHygiene"     boolean default false          not null
);

create table if not exists "SentReminders"
(
  id                   uuid                             not null
    constraint "SentReminders_pkey"
      primary key,
  "accountId"          uuid                             not null
    constraint "SentReminders_accountId_fkey"
      references "Accounts"
      on update cascade,
  "reminderId"         uuid                             not null
    constraint "SentReminders_reminderId_fkey"
      references "Reminders"
      on update cascade,
  "contactedPatientId" uuid                             not null
    constraint "SentReminders_patientId_fkey"
      references "Patients"
      on update cascade,
  "isSent"             boolean default false            not null,
  "isConfirmed"        boolean default false            not null,
  "primaryType"        "enum_SentReminders_primaryType" not null,
  "lengthSeconds"      integer,
  "createdAt"          timestamp with time zone         not null,
  "updatedAt"          timestamp with time zone         not null,
  "deletedAt"          timestamp with time zone,
  "errorCode"          varchar(255),
  "isConfirmable"      boolean default true             not null,
  interval             varchar(255),
  "isFamily"           boolean default false            not null
);

create table if not exists "SyncClientErrors"
(
  id               uuid                              not null
    constraint "SyncClientErrors_pkey"
      primary key,
  "syncId"         bigint                            not null,
  "accountId"      uuid                              not null
    constraint "SyncClientErrors_accountId_fkey"
      references "Accounts"
      on update cascade,
  version          varchar(255),
  adapter          varchar(255),
  operation        "enum_SyncClientErrors_operation" not null,
  success          boolean,
  model            varchar(255),
  "documentId"     varchar(255),
  payload          text,
  "customErrorMsg" text,
  "errorMessage"   text,
  "stackTrace"     text,
  "createdAt"      timestamp with time zone          not null,
  "updatedAt"      timestamp with time zone          not null,
  "deletedAt"      timestamp with time zone
);

create table if not exists "TextMessages"
(
  id                            varchar(255)             not null
    constraint "TextMessages_pkey"
      primary key,
  "chatId"                      uuid                     not null
    constraint "TextMessages_chatId_fkey"
      references "Chats"
      on update cascade on delete cascade,
  "userId"                      uuid
    constraint "TextMessages_userId_fkey"
      references "Users"
      on update cascade,
  "to"                          varchar(255)             not null,
  "from"                        varchar(255)             not null,
  body                          text,
  "smsStatus"                   varchar(255),
  "dateCreated"                 timestamp with time zone,
  "dateUpdated"                 timestamp with time zone,
  "apiVersion"                  varchar(255),
  "accountSid"                  varchar(255),
  read                          boolean default false    not null,
  "toZip"                       varchar(255),
  "toCity"                      varchar(255),
  "toState"                     varchar(255),
  "toCountry"                   varchar(255),
  "fromZip"                     varchar(255),
  "fromCity"                    varchar(255),
  "fromState"                   varchar(255),
  "fromCountry"                 varchar(255),
  "numMedia"                    integer,
  "numSegments"                 integer,
  "mediaData"                   jsonb,
  "createdAt"                   timestamp with time zone not null,
  "updatedAt"                   timestamp with time zone not null,
  "deletedAt"                   timestamp with time zone,
  "isOutsideOfficeHoursRespond" boolean default false
);

create table if not exists "Tokens"
(
  id              varchar(255)             not null
    constraint "Tokens_pkey"
      primary key,
  "appointmentId" uuid
    constraint "Tokens_appointmentId_fkey"
      references "Appointments"
      on update cascade,
  "patientUserId" uuid,
  "createdAt"     timestamp with time zone not null,
  "updatedAt"     timestamp with time zone not null,
  "deletedAt"     timestamp with time zone,
  "accountId"     uuid
);

create table if not exists "WaitSpots"
(
  id                uuid                     not null
    constraint "WaitSpots_pkey"
      primary key,
  "accountId"       uuid                     not null
    constraint "WaitSpots_accountId_fkey"
      references "Accounts"
      on update cascade,
  "patientId"       uuid
    constraint "WaitSpots_patientId_fkey"
      references "Patients"
      on update cascade,
  "patientUserId"   uuid
    constraint "WaitSpots_patientUserId_fkey"
      references "PatientUsers"
      on update cascade,
  preferences       jsonb default '{"evenings": true, "mornings": true, "weekdays": true, "weekends": true, "afternoons": true}'::jsonb,
  "unavailableDays" date[],
  "endDate"         timestamp with time zone,
  "createdAt"       timestamp with time zone not null,
  "updatedAt"       timestamp with time zone not null,
  "deletedAt"       timestamp with time zone,
  "appointmentId"   uuid
    constraint "WaitSpots_appointmentId_fkey"
      references "Appointments"
      on update cascade,
  "daysOfTheWeek"   jsonb,
  "availableTimes"  timestamp with time zone[],
  "reasonId"        uuid
    constraint "WaitSpots_reasonId_fkey"
      references "Services"
      on update cascade,
  "practitionerId"  uuid
    constraint "WaitSpots_practitionerId_fkey"
      references "Practitioners"
      on update cascade
);

create table if not exists "Reviews"
(
  id               uuid                     not null
    constraint "Reviews_pkey"
      primary key,
  "accountId"      uuid                     not null
    constraint "Reviews_accountId_fkey"
      references "Accounts"
      on update cascade,
  "practitionerId" uuid
    constraint "Reviews_practitionerId_fkey"
      references "Practitioners"
      on update cascade on delete set null,
  "patientId"      uuid
    constraint "Reviews_patientId_fkey"
      references "Patients"
      on update cascade on delete set null,
  "patientUserId"  uuid
    constraint "Reviews_patientUserId_fkey"
      references "PatientUsers"
      on update cascade on delete set null,
  stars            integer                  not null,
  description      text,
  "createdAt"      timestamp with time zone not null,
  "updatedAt"      timestamp with time zone not null,
  "deletedAt"      timestamp with time zone
);

create table if not exists "SentReviews"
(
  id               uuid                                                                           not null
    constraint "SentReviews_pkey"
      primary key,
  "accountId"      uuid                                                                           not null
    constraint "SentReviews_accountId_fkey"
      references "Accounts"
      on update cascade,
  "practitionerId" uuid
    constraint "SentReviews_practitionerId_fkey"
      references "Practitioners"
      on update cascade on delete set null,
  "patientId"      uuid                                                                           not null
    constraint "SentReviews_patientId_fkey"
      references "Patients"
      on update cascade,
  "appointmentId"  uuid                                                                           not null
    constraint "SentReviews_appointmentId_fkey"
      references "Appointments"
      on update cascade,
  "reviewId"       uuid
    constraint "SentReviews_reviewId_fkey"
      references "Reviews"
      on update cascade on delete set null,
  "isSent"         boolean                        default false                                   not null,
  "isCompleted"    boolean                        default false                                   not null,
  "primaryType"    "enum_SentReviews_primaryType" default 'email'::"enum_SentReviews_primaryType" not null,
  "createdAt"      timestamp with time zone                                                       not null,
  "updatedAt"      timestamp with time zone                                                       not null,
  "deletedAt"      timestamp with time zone,
  "errorCode"      varchar(255)
);

create table if not exists "ConnectorVersions"
(
  id          uuid                     not null
    constraint "ConnectorVersions_pkey"
      primary key,
  tag         varchar(255),
  url         varchar(255),
  key         varchar(255),
  secret      varchar(255),
  filename    varchar(255),
  path        varchar(255),
  bucket      varchar(255),
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "Procedures"
(
  code          varchar(255)              not null
    constraint "Procedures_pkey"
      primary key,
  type          varchar(255)              not null,
  description   varchar(255),
  "createdAt"   timestamp with time zone  not null,
  "updatedAt"   timestamp with time zone  not null,
  "deletedAt"   timestamp with time zone,
  "codeType"    varchar(255) default 'CDA'::character varying,
  "isValidated" boolean      default true not null
);

create table if not exists "DeliveredProcedures"
(
  id                         uuid                     not null
    constraint "DeliveredProcedures_pkey"
      primary key,
  "accountId"                uuid                     not null
    constraint "DeliveredProcedures_accountId_fkey"
      references "Accounts"
      on update cascade,
  "entryDate"                timestamp with time zone not null,
  "procedureCodeId"          varchar(255)             not null
    constraint "DeliveredProcedures_procedureCode_fkey"
      references "Procedures"
      on update cascade,
  "patientId"                uuid                     not null
    constraint "DeliveredProcedures_patientId_fkey"
      references "Patients"
      on update cascade,
  "pmsId"                    varchar(255),
  units                      double precision,
  "totalAmount"              double precision,
  "primaryInsuranceAmount"   double precision,
  "secondaryInsuranceAmount" double precision,
  "patientAmount"            double precision,
  "discountAmount"           double precision,
  "createdAt"                timestamp with time zone not null,
  "updatedAt"                timestamp with time zone not null,
  "deletedAt"                timestamp with time zone,
  "isCompleted"              boolean default true     not null,
  "procedureCode"            varchar(255)             not null,
  "practitionerId"           uuid
);

create index if not exists delivered_procedures_account_id_pms_id
  on "DeliveredProcedures" ("accountId", "pmsId");

create table if not exists "Configurations"
(
  id             uuid                     not null
    constraint "Configurations_pkey"
      primary key,
  "defaultValue" varchar(255),
  description    varchar(255)             not null,
  name           varchar(255)             not null,
  type           varchar(255),
  "createdAt"    timestamp with time zone not null,
  "updatedAt"    timestamp with time zone not null,
  "deletedAt"    timestamp with time zone
);

create table if not exists "AccountConfigurations"
(
  id                uuid                     not null
    constraint "AccountConfigurations_pkey"
      primary key,
  value             varchar(255),
  "configurationId" uuid                     not null
    constraint "AccountConfigurations_configurationId_fkey"
      references "Configurations"
      on update cascade,
  "accountId"       uuid                     not null
    constraint "AccountConfigurations_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "createdAt"       timestamp with time zone not null,
  "updatedAt"       timestamp with time zone not null,
  "deletedAt"       timestamp with time zone
);

create table if not exists "PatientUserResets"
(
  id              uuid                     not null
    constraint "PatientUserResets_pkey"
      primary key,
  "patientUserId" uuid
    constraint "PatientUserResets_patientUserId_fkey"
      references "PatientUsers"
      on update cascade,
  token           varchar(255),
  "createdAt"     timestamp with time zone not null,
  "updatedAt"     timestamp with time zone not null,
  "deletedAt"     timestamp with time zone,
  "accountId"     uuid
);

create table if not exists "Correspondences"
(
  id                uuid                     not null
    constraint "Correspondences_pkey"
      primary key,
  "pmsId"           varchar(255),
  "accountId"       uuid                     not null,
  "patientId"       uuid                     not null,
  "appointmentId"   uuid,
  type              varchar(255),
  "pmsType"         varchar(255),
  note              text,
  "contactedAt"     timestamp with time zone,
  "isSyncedWithPms" boolean default false    not null,
  "createdAt"       timestamp with time zone not null,
  "updatedAt"       timestamp with time zone not null,
  "deletedAt"       timestamp with time zone,
  method            varchar(255),
  "sentReminderId"  uuid
    constraint "Correspondences_sentReminderId_fkey"
      references "SentReminders"
      on update cascade on delete set null,
  "sentRecallId"    uuid
    constraint "Correspondences_sentRecallId_fkey"
      references "SentRecalls"
      on update cascade on delete set null,
  "sentReviewId"    uuid,
  constraint "correspondence_accountId_pmsId_unique"
    unique ("accountId", "pmsId"),
  constraint "correspondence_type_sentRecallId_unique"
    unique (type, "sentRecallId"),
  constraint "correspondence_type_sentReminderId_patientId_unique"
    unique (type, "sentReminderId", "patientId", "appointmentId")
);

create table if not exists "CronConfigurations"
(
  id             uuid                     not null
    constraint "CronConfigurations_pkey"
      primary key,
  "defaultValue" varchar(255),
  description    varchar(255)             not null,
  name           varchar(255)             not null,
  type           varchar(255),
  "createdAt"    timestamp with time zone not null,
  "updatedAt"    timestamp with time zone not null,
  "deletedAt"    timestamp with time zone
);

create table if not exists "AccountCronConfigurations"
(
  id                    uuid                     not null
    constraint "AccountCronConfigurations_pkey"
      primary key,
  value                 varchar(255),
  "cronConfigurationId" uuid                     not null
    constraint "AccountCronConfigurations_cronConfigurationId_fkey"
      references "CronConfigurations"
      on update cascade,
  "accountId"           uuid                     not null
    constraint "AccountCronConfigurations_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "createdAt"           timestamp with time zone not null,
  "updatedAt"           timestamp with time zone not null,
  "deletedAt"           timestamp with time zone
);

create table if not exists "DailySchedules"
(
  id               uuid                                                                             not null
    constraint "DailySchedules_pkey"
      primary key,
  "pmsId"          varchar(255),
  "practitionerId" uuid
    constraint "DailySchedules_practitionerId_fkey"
      references "Practitioners",
  date             date,
  "startTime"      timestamp with time zone                                                         not null,
  "endTime"        timestamp with time zone                                                         not null,
  breaks           jsonb[]        default ARRAY []::jsonb[]                                         not null,
  "chairIds"       varchar(255)[] default (ARRAY []::character varying[])::character varying(255)[] not null,
  "createdAt"      timestamp with time zone                                                         not null,
  "updatedAt"      timestamp with time zone                                                         not null,
  "deletedAt"      timestamp with time zone,
  "accountId"      uuid
    constraint "DailySchedules_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade
);

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_mondayId_fkey"
    foreign key ("mondayId") references "DailySchedules"
      on update cascade on delete set null;

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_tuesdayId_fkey"
    foreign key ("tuesdayId") references "DailySchedules"
      on update cascade on delete set null;

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_wednesdayId_fkey"
    foreign key ("wednesdayId") references "DailySchedules"
      on update cascade on delete set null;

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_thursdayId_fkey"
    foreign key ("thursdayId") references "DailySchedules"
      on update cascade on delete set null;

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_fridayId_fkey"
    foreign key ("fridayId") references "DailySchedules"
      on update cascade on delete set null;

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_saturdayId_fkey"
    foreign key ("saturdayId") references "DailySchedules"
      on update cascade on delete set null;

alter table "WeeklySchedules"
  add constraint "WeeklySchedules_sundayId_fkey"
    foreign key ("sundayId") references "DailySchedules"
      on update cascade on delete set null;

create table if not exists "AppointmentCodes"
(
  id              uuid                     not null
    constraint "AppointmentCodes_pkey"
      primary key,
  "appointmentId" uuid                     not null
    constraint "AppointmentCodes_appointmentId_fkey"
      references "Appointments"
      on update cascade on delete cascade,
  code            varchar(255)             not null,
  "createdAt"     timestamp with time zone not null,
  "updatedAt"     timestamp with time zone not null,
  "deletedAt"     timestamp with time zone
);

create table if not exists "PatientUserFamilies"
(
  id          uuid                     not null
    constraint "PatientUserFamilies_pkey"
      primary key,
  "headId"    uuid
    constraint "PatientUserFamilies_headId_fkey"
      references "PatientUsers"
      on update cascade on delete set null,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

alter table "PatientUsers"
  add constraint "PatientUsers_patientUserFamilyId_fkey"
    foreign key ("patientUserFamilyId") references "PatientUserFamilies"
      on update cascade on delete set null;

create table if not exists "PatientRecalls"
(
  id          uuid                     not null
    constraint "PatientRecalls_pkey"
      primary key,
  "accountId" uuid                     not null
    constraint "PatientRecalls_accountId_fkey"
      references "Accounts",
  "patientId" uuid                     not null
    constraint "PatientRecalls_patientId_fkey"
      references "Patients",
  "pmsId"     varchar(255),
  "dueDate"   timestamp with time zone not null,
  type        varchar(255),
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone
);

create table if not exists "PatientSearches"
(
  id          uuid                     not null
    constraint "PatientSearches_pkey"
      primary key,
  "userId"    uuid                     not null
    constraint "PatientSearches_userId_fkey"
      references "Users"
      on update cascade,
  "accountId" uuid                     not null
    constraint "PatientSearches_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "patientId" uuid                     not null
    constraint "PatientSearches_patientId_fkey"
      references "Patients"
      on update cascade,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "deletedAt" timestamp with time zone,
  context     varchar(255) default 'topBar'::character varying
);

create table if not exists "SentRemindersPatients"
(
  id                     uuid                     not null,
  "sentRemindersId"      uuid                     not null
    constraint "SentRemindersPatients_sentRemindersId_fkey"
      references "SentReminders",
  "patientId"            uuid                     not null
    constraint "SentRemindersPatients_patientId_fkey"
      references "Patients",
  "appointmentId"        uuid                     not null
    constraint "SentRemindersPatients_appointmentId_fkey"
      references "Appointments",
  "createdAt"            timestamp with time zone not null,
  "updatedAt"            timestamp with time zone not null,
  "deletedAt"            timestamp with time zone,
  "appointmentStartDate" timestamp with time zone,
  constraint "SentRemindersPatients_pkey"
    primary key (id, "sentRemindersId")
);

create table if not exists "Templates"
(
  id             uuid                     not null
    constraint "Templates_pkey"
      primary key,
  "templateName" varchar(255)             not null,
  values         jsonb                    not null,
  "createdAt"    timestamp with time zone not null,
  "updatedAt"    timestamp with time zone not null,
  "deletedAt"    timestamp with time zone
);

create table if not exists "AccountTemplates"
(
  id           uuid                     not null
    constraint "AccountTemplates_pkey"
      primary key,
  "accountId"  uuid
    constraint "AccountTemplates_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "templateId" uuid                     not null
    constraint "AccountTemplates_templateId_fkey"
      references "Templates"
      on update cascade on delete cascade,
  value        varchar(255)             not null,
  "createdAt"  timestamp with time zone not null,
  "updatedAt"  timestamp with time zone not null,
  "deletedAt"  timestamp with time zone
);

create table if not exists "ReasonDailyHours"
(
  id          uuid      default uuid_generate_v4() not null
    constraint "ReasonDailySchedules_pkey"
      primary key,
  "accountId" uuid                                 not null
    constraint "ReasonDailySchedules_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  date        date,
  "isClosed"  boolean   default false              not null,
  "createdAt" timestamp default now(),
  "updatedAt" timestamp default now()
);

comment on column "ReasonDailyHours"."isClosed" is 'undefined';

create table if not exists "ReasonWeeklyHours"
(
  id            uuid      default uuid_generate_v4() not null
    constraint "ReasonSchedules_pkey"
      primary key,
  "accountId"   uuid                                 not null
    constraint "ReasonSchedules_accountId_fkey"
      references "Accounts"
      on update cascade on delete cascade,
  "mondayId"    uuid                                 not null
    constraint "ReasonSchedules_mondayId_fkey"
      references "ReasonDailyHours",
  "tuesdayId"   uuid                                 not null
    constraint "ReasonSchedules_tuesdayId_fkey"
      references "ReasonDailyHours",
  "wednesdayId" uuid                                 not null
    constraint "ReasonSchedules_wednesdayId_fkey"
      references "ReasonDailyHours",
  "thursdayId"  uuid                                 not null
    constraint "ReasonSchedules_thursdayId_fkey"
      references "ReasonDailyHours",
  "fridayId"    uuid                                 not null
    constraint "ReasonSchedules_fridayId_fkey"
      references "ReasonDailyHours",
  "saturdayId"  uuid                                 not null
    constraint "ReasonSchedules_saturdayId_fkey"
      references "ReasonDailyHours",
  "sundayId"    uuid                                 not null
    constraint "ReasonSchedules_sundayId_fkey"
      references "ReasonDailyHours",
  "reasonId"    uuid
    constraint "FK_04ec6d08518c7f5d6eff20f005f"
      references "Services",
  "createdAt"   timestamp default now(),
  "updatedAt"   timestamp default now()
);

alter table "Services"
  add constraint "FK_78d09bd2162a8352d43e332e6ce"
    foreign key ("reasonWeeklyHoursId") references "ReasonWeeklyHours"
      on update cascade on delete set null;

create table if not exists migrations
(
  id        serial  not null
    constraint "PK_8c82d7f526340ab734260ea46be"
      primary key,
  timestamp bigint  not null,
  name      varchar not null
);

create table if not exists "ReasonDailyHoursAvailabilities"
(
  id                   uuid      default uuid_generate_v4() not null
    constraint "PK_81d920e5a564858d22b2556f1de"
      primary key,
  "reasonDailyHoursId" uuid                                 not null
    constraint "ReasonDailyHoursAvailabilities_reasonDailyHoursId_fkey"
      references "ReasonDailyHours"
      on delete cascade,
  "startTime"          time                                 not null,
  "endTime"            time                                 not null,
  "createdAt"          timestamp default now(),
  "updatedAt"          timestamp default now()
);

create table if not exists "ReasonDailyHoursBreaks"
(
  id                   uuid      default uuid_generate_v4() not null
    constraint "PK_d9b29b872f9412e6c7213884c76"
      primary key,
  "reasonDailyHoursId" uuid                                 not null
    constraint "ReasonDailyHoursBreaks_reasonDailyHoursId_fkey"
      references "ReasonDailyHours"
      on delete cascade,
  "startTime"          time                                 not null,
  "endTime"            time                                 not null,
  "createdAt"          timestamp default now(),
  "updatedAt"          timestamp default now()
);


WITH templates AS (
  INSERT INTO "Templates" (id, "templateName", values, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(),
                                                                                                      'donna-respond-outside-office-hours',
                                                                                                      '{"account.name": true, "nextOpenedTime": true}',
                                                                                                      now(),
                                                                                                      now(),
                                                                                                      null),
                                                                                                     (uuid_generate_v4(),
                                                                                                      'review-request',
                                                                                                      '{"link": true, "account.name": true, "patient.firstName": true}',
                                                                                                      now(),
                                                                                                      now(),
                                                                                                      null) RETURNING *
)
INSERT INTO "AccountTemplates" (id, "accountId", "templateId", value, "createdAt", "updatedAt", "deletedAt")
VALUES (uuid_generate_v4(),
        null,
         (SELECT "id" FROM  templates WHERE "templateName" = 'donna-respond-outside-office-hours'),
        '$\{account.name} is currently closed. We will be back $\{nextOpenedTime} and will respond to you then.',
        now(),
        now(),
        null),
       (uuid_generate_v4(),
        null,
        (SELECT "id" FROM  templates WHERE "templateName" = 'review-request'),
        '$\{patient.firstName}, we hope you had a lovely visit at $\{account.name}. Let us know how it went by clicking the link below. $\{link}',
        now(),
        now(),
        null);

INSERT INTO "CronConfigurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), null, 'The last time the Cron for a patients Last Hygiene was run', 'CRON_LAST_HYGIENE', 'isoString', now(), now(), null);
INSERT INTO "CronConfigurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), null, 'The last time the Cron for a patients Last Recall was run', 'CRON_LAST_RECALL', 'isoString',  now(), now(), null);
INSERT INTO "CronConfigurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), null, 'The last time the Cron for a patients Last Restorative was run', 'CRON_LAST_RESTORATIVE', 'isoString',  now(), now(), null);
INSERT INTO "CronConfigurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), null, 'The last time the Cron for a patients due date was run', 'CRON_DUE_DATE', 'isoString',  now(), now(), null);

INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of appointment sync', 'APPOINTMENT_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of patient sync', 'PATIENT_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of procedure sync', 'PROCEDURE_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), null, 'The adapter type', 'ADAPTER_TYPE', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '0', 'Is connector enabled', 'CONNECTOR_ENABLED', 'boolean', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of family sync', 'FAMILY_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of chair sync', 'CHAIR_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of practitioner sync', 'PRACTITIONER_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of practitioner schedule sync', 'PRACTITIONER_SCHEDULE_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '300', 'The full sync interval', 'FULL_SYNC_INTERVAL', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '20', 'The quick sync interval', 'QUICK_SYNC_INTERVAL', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), 'REDIS', 'The cache engine', 'CACHE_ENGINE', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '1', 'Is full sync enabled', 'FULL_SYNC_ENABLED', 'boolean', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '1', 'Is quick sync enabled', 'QUICK_SYNC_ENABLED', 'boolean', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '1', 'Turns Connector auto update functionality on or off.', 'AUTO_UPDATE_ENABLED', 'boolean', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of correspondence sync', 'CORRESPONDENCE_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '1', 'Turns bidirectional sync functionality on or off.', 'BIDIRECTIONAL_SYNC_ENABLED', 'boolean', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of daily schedule sync', 'DAILY_SCHEDULE_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '100', 'The batch size of patient recall sync', 'PATIENT_RECALL_BATCH_SIZE', 'integer', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'The default continuing care reasons for hygiene', 'HYGIENE_TYPES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'The default continuing care reasons for recall', 'RECALL_TYPES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of statuses that will be used to determine if an Appointment is confirmed', 'APPOINTMENT_CONFIRMED_STATUSES_READ', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '', 'The custom status that will be set on an Appointment when CareCru confirms it', 'APPOINTMENT_CONFIRMED_STATUS_WRITE', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '', 'The custom status that will be set on an Appointment when CareCru unconfirms it', 'APPOINTMENT_UNCONFIRMED_STATUS_WRITE', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of statuses that will be used to determine if an Appointment is missed', 'APPOINTMENT_MISSED_STATUSES_READ', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '', 'The custom status that will be set on an Appointment when CareCru marks it as isMissed=true', 'APPOINTMENT_MISSED_STATUS_WRITE', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '', 'The custom status that will be set on an Appointment when CareCru marks it as isMissed=false', 'APPOINTMENT_UNMISSED_STATUS_WRITE', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of PMS Practitioner Ids whose patients are not synced', 'IGNORED_PRACTITIONER_PMS_IDS', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '', 'The custom db url that the connector will use.', 'DB_CONNECTION_URL', 'string', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of "hygiene" procedure codes', 'HYGIENE_PROCEDURE_CODES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of "recall exam" procedure codes', 'RECALL_PROCEDURE_CODES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of "new patient exam" procedure codes', 'NP_EXAM_PROCEDURE_CODES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of "restorative" procedure codes', 'RESTORATIVE_PROCEDURE_CODES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of types of the appointments that need to be synced as not bookable', 'APPOINTMENT_NOT_BOOKABLE_TYPES', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '0', 'Set practitioner to hygienist for hygiene appointments.', 'SET_HYGIENIST_FOR_HYGIENE_APPOINTMENT', 'boolean', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), '[]', 'A json array of Eaglesoft API url, integration key, userId and password', 'EAGLESOFT_API_CONFIGURATION', 'json', now(), now(), null);
INSERT INTO "Configurations" (id, "defaultValue", description, name, type, "createdAt", "updatedAt", "deletedAt") VALUES (uuid_generate_v4(), 'care.cru:5100', 'API Hostname configuration. Connector will connect to this hostname', 'API_HOSTNAME', 'string', now(), now(), null);
`,
          { transaction: t },
        );

        const syncProcedures = procedures.map(procedure => ({
          ...procedure,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        return queryInterface.bulkInsert('Procedures', syncProcedures, { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    }),

  down: queryInterface =>
    queryInterface.sequelize.transaction(async (t) => {
      if (!devOrTestEnv) {
        console.log(skipMigrationMessage);
        return Promise.resolve();
      }

      try {
        await queryInterface.sequelize.query(
          `
drop table if exists "SequelizeMeta" cascade;

drop table if exists "AuthSessions" cascade;

drop table if exists "Calls" cascade;

drop table if exists "Invites" cascade;

drop table if exists "PinCodes" cascade;

drop table if exists "Practitioner_Services" cascade;

drop table if exists "PractitionerRecurringTimeOffs" cascade;

drop table if exists "Requests" cascade;

drop table if exists "Segments" cascade;

drop table if exists "SyncClientErrors" cascade;

drop table if exists "SyncClientVersions" cascade;

drop table if exists "TextMessages" cascade;

drop table if exists "Chats" cascade;

drop table if exists "Tokens" cascade;

drop table if exists "WaitSpots" cascade;

drop table if exists "PasswordResets" cascade;

drop table if exists "SentReviews" cascade;

drop table if exists "Reviews" cascade;

drop table if exists "ConnectorVersions" cascade;

drop table if exists "DeliveredProcedures" cascade;

drop table if exists "Procedures" cascade;

drop table if exists "AccountConfigurations" cascade;

drop table if exists "Configurations" cascade;

drop table if exists "PatientUserResets" cascade;

drop table if exists "Correspondences" cascade;

drop table if exists "SentRecalls" cascade;

drop table if exists "Recalls" cascade;

drop table if exists "AccountCronConfigurations" cascade;

drop table if exists "CronConfigurations" cascade;

drop table if exists "DailySchedules" cascade;

drop table if exists "AppointmentCodes" cascade;

drop table if exists "PatientUserFamilies" cascade;

drop table if exists "PatientRecalls" cascade;

drop table if exists "PatientSearches" cascade;

drop table if exists "Users" cascade;

drop table if exists "Permissions" cascade;

drop table if exists "SentRemindersPatients" cascade;

drop table if exists "SentReminders" cascade;

drop table if exists "PatientUsers" cascade;

drop table if exists "Patients" cascade;

drop table if exists "Appointments" cascade;

drop table if exists "Chairs" cascade;

drop table if exists "Practitioners" cascade;

drop table if exists "Families" cascade;

drop table if exists "Reminders" cascade;

drop table if exists "AccountTemplates" cascade;

drop table if exists "Templates" cascade;

drop table if exists "ReasonWeeklyHours" cascade;

drop table if exists "Services" cascade;

drop table if exists migrations cascade;

drop sequence if exists migrations_id_seq;

drop table if exists "ReasonDailyHoursAvailabilities" cascade;

drop table if exists "ReasonDailyHoursBreaks" cascade;

drop table if exists "ReasonDailyHours" cascade;

drop table if exists "Accounts" cascade;

drop table if exists "Enterprises" cascade;

drop table if exists "WeeklySchedules" cascade;

drop table if exists "Addresses" cascade;

drop type if exists "enum_Enterprises_plan";

drop type if exists "enum_Patients_status";

drop type if exists "enum_Permissions_role";

drop type if exists "enum_Invites_role";

drop type if exists "enum_PractitionerRecurringTimeOffs_dayOfWeek";

drop type if exists "enum_Recalls_primaryType";

drop type if exists "enum_Reminders_primaryType";

drop type if exists "enum_Segments_reference";

drop type if exists "enum_SentRecalls_primaryType";

drop type if exists "enum_SentReminders_primaryType";

drop type if exists "enum_SyncClientErrors_operation";

drop type if exists "enum_SentReviews_primaryType";
`,
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    }),
};
