
export const SET_IS_COLLAPSED = 'SET_IS_COLLAPSED';

export const FETCH_REPUTATION = 'vendasta/fetchReputation';
export const FETCH_REPUTATION_SUCCESS = 'vendasta/fetchReputationSuccess';
export const FETCH_REPUTATION_ERROR = 'vendasta/fetchReputationError';

export const FETCH_REVIEWS = 'vendasta/fetchReviews';
export const FETCH_REVIEWS_SUCCESS = 'vendasta/fetchReviewsSuccess';
export const FETCH_REVIEWS_ERROR = 'vendasta/fetchReviewsError';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const SET_RESET_EMAIL = 'SET_RESET_EMAIL';
export const SET_FAMILY_PATIENTS = 'SET_FAMILY_PATIENTS';
export const SET_FAMILY_PATIENT_USER = 'SET_FAMILY_PATIENT_USER';

export const FETCH_ENTITIES = 'FETCH_ENTITIES';
export const FETCH_MODEL = 'FETCH_MODEL';
export const RECEIVE_ENTITIES = 'RECEIVE_ENTITIES';
export const CREATE_ENTITY = 'CREATE_ENTITY';
export const UPDATE_ENTITY = 'UPDATE_ENTITY';
export const DELETE_ENTITY = 'DELETE_ENTITY';
export const DELETE_ALL_ENTITY = 'DELETE_ALL_ENTITY';
export const ADD_ENTITY = 'ADD_ENTITY';

/**
 * REQUEST SECTION
 */
export const SET_HOVER_REQUEST_ID = 'SET_HOVER_REQUEST_ID';
export const SET_REQUEST_COUNT = 'SET_REQUEST_COUNT';
export const SET_UNDO_REQUEST = 'SET_UNDO_REQUEST';

/**
 * SCHEDULE SECTION
 * */
export const SET_MERGING = 'SET_MERGING';
export const SET_SCHEDULE_DATE = 'SET_SCHEDULE_DATE';
export const SELECT_APPOINTMENT = 'SELECT_APPOINTMENT';
export const SELECT_WAITSPOT = 'SELECT_WAITSPOT';
export const ADD_SCHEDULE_FILTER = 'ADD_SCHEDULE_FILTER';
export const REMOVE_SCHEDULE_FILTER = 'REMOVE_SCHEDULE_FILTER';
export const CLEAR_SCHEDULE_FILTER = 'CLEAR_SCHEDULE_FILTER';
export const ADD_ALL_SCHEDULE_FILTER = 'ADD_ALL_SCHEDULE_FILTER';
export const SET_SYNCING = 'SET_SYNCING';
export const SET_SCHEDULE_VIEW = 'SET_SCHEDULE_VIEW';
export const CREATE_NEW_PATIENT = 'CREATE_NEW_PATIENT';

export const SET_CURRENT_DIALOG = 'SET_CURRENT_DIALOG';
export const SET_DIALOG_SCROLL_PERMISSION = 'SET_DIALOG_SCROLL_PERMISSION';
export const SEND_MESSAGE_ON_CLIENT = 'SEND_MESSAGE_ON_CLIENT';
export const SET_SCHEDULE_MODE = 'SET_SCHEDULE_MODE';

export const SET_SELECTED_PATIENT_ID = 'SET_SELECTED_PATIENT_ID';
export const SET_SELECTED_CHAT_ID = 'SET_SELECTED_CHAT_ID';
export const SEARCH_PATIENT = 'SEARCH_PATIENT';
export const READ_MESSAGES_IN_CURRENT_DIALOG = 'READ_MESSAGES_IN_CURRENT_DIALOG';
export const UPDATE_EDITING_PATIENT_STATE = 'UPDATE_EDITING_PATIENT_STATE';
// export const CHANGE_PATIENT_INFO = 'CHANGE_PATIENT_INFO';
export const UPDATE_PATIENT_IN_PATIENT_LIST = 'UPDATE_PATIENT_IN_PATIENT_LIST';

export const SIX_DAYS_SHIFT = 'SIX_DAYS_SHIFT';
export const SET_START_DATE = 'SET_START_DATE';
export const SET_SELECTED_PRACTITIONER_ID = 'SET_SELECTED_PRACTITIONER_ID';
export const SET_SELECTED_SERVICE_ID = 'SET_SELECTED_SERVICE_ID';
export const CHANGE_PATIENT_INFO = 'CHANGE_PATIENT_INFO';
export const CREATE_PATIENT = 'CREATE_PATIENT';
export const SET_STARTING_APPOINTMENT_TIME = 'SET_STARTING_APPOINTMENT_TIME';
export const SET_REGISTRATION_STEP = 'SET_REGISTRATION_STEP';
export const SET_CLINIC_INFO = 'SET_CLINIC_INFO';
export const SET_SELECTED_AVAILABILITY = 'SET_SELECTED_AVAILABILITY';
export const SET_NEXT_AVAILABILITY = 'SET_NEXT_AVAILABILITY';
export const SET_NOTES = 'SET_NOTES';
export const SET_INSURANCE_MEMBER_ID = 'SET_INSURANCE_MEMBER_ID';
export const SET_INSURANCE_CARRIER = 'SET_INSURANCE_CARRIER';
export const SET_SENTRECALLID = 'SET_SENTRECALLID';
export const SET_DUE_DATE = 'SET_DUE_DATE';

export const SET_SERVICE_ID = 'SET_SERVICE_ID';
export const SET_PRACTITIONER_ID = 'SET_PRACTITIONER_ID';

export const SET_RESERVATION = 'SET_RESERVATION';
export const REMOVE_RESERVATION = 'REMOVE_RESERVATION';

export const ADD_SOCKET_ENTITY = 'ADD_SOCKET_ENTITY';

export const SET_IS_FETCHING = 'SET_IS_FETCHING';
export const SET_PATIENT_USER = 'SET_PATIENT_USER';
export const SET_IS_BOOKING = 'SET_IS_BOOKING';
export const SET_AVAILABILITIES = 'SET_AVAILABILITIES';
export const SET_IS_CONFIRMING = 'SET_IS_CONFIRMING';
export const SET_IS_LOGIN = 'SET_IS_LOGIN';
export const SET_FORGOT_PASSWORD = 'SET_FORGOT_PASSWORD';
export const SET_IS_TIMER_EXPIRED = 'SET_IS_TIMER_EXPIRED';
export const SET_HAS_WAITLIST = 'SET_HAS_WAITLIST';
export const UPDATE_WAITSPOT = 'UPDATE_WAITSPOT';
export const SET_IS_SUCCESSFUL_BOOKING = 'SET_IS_SUCCESSFUL_BOOKING';
export const REFRESH_AVAILABILITIES_STATE = 'REFRESH_AVAILABILITIES_STATE';

export const PREVIEW_SEGMENT_ATTEMPT = 'PREVIEW_SEGMENT_ATTEMPT';
export const PREVIEW_SEGMENT_SUCCESS = 'PREVIEW_SEGMENT_SUCCESS';
export const PREVIEW_SEGMENT_ERROR = 'PREVIEW_SEGMENT_ERROR';

export const SEGMENTS_FETCH_CITIES_ATTEMPT = 'SEGMENTS_FETCH_CITIES_ATTEMPT';
export const SEGMENTS_FETCH_CITIES_SUCCESS = 'SEGMENTS_FETCH_CITIES_SUCCESS';
export const SEGMENTS_FETCH_CITIES_ERROR = 'SEGMENTS_FETCH_CITIES_ERROR';

export const SEGMENT_APPLY = 'SEGMENT_APPLY';
export const SEGMENT_REMOVE_APPLIED = 'SEGMENT_REMOVE_APPLIED';
export const SEGMENT_SET_NAME = 'SEGMENT_SET_NAME';

/**
 * REPUTATION SECTION
 */
export const SET_REPUTATION_FILTER = 'SET_REPUTATION_FILTER';
export const SET_FILTERS_LOADED = 'SET_FILTERS_LOADED';

/*
  Intelligence Section
 */
export const QUERY_DATES = 'QUERY_DATES';

/**
 * ELECTRON IPC CONSTANTS
 */

export const SHOW_TOOLBAR = 'SHOW_TOOLBAR';
export const TOOLBAR_POSITION_CHANGE = 'TOOLBAR_POSITION_CHANGE';
export const REQUEST_TOOLBAR_POSITION = 'REQUEST_TOOLBAR_POSITION';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const APP_VERSION_REQUEST = 'APP_VERSION_REQUEST';
export const APP_VERSION_RESPONSE = 'APP_VERSION_RESPONSE';
export const RESIZE_WINDOW = 'RESIZE_WINDOW';
export const SHOW_CONTENT = 'SHOW_CONTENT';
export const HIDE_USER_MODAL = 'HIDE_USER_MODAL';
export const SHOW_USER_MODAL = 'SHOW_USER_MODAL';
export const HIDDEN_USER_MODAL = 'HIDDEN_USER_MODAL';
export const OPEN_EXTERNAL_LINK = 'EXTERNAL_LINK';
export const REQUEST_USER_DATA = 'REQUEST_USER_DATA';
export const SET_USER_DATA = 'SET_USER_DATA';
