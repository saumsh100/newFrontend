
import has from 'lodash/has';

const allow = (...rules) => {
  const allowAll = {
    create: true,
    read: true,
    update: true,
    delete: true,
  };

  const denyAll = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  const acts = (rules.length ? rules : [])
    .map(r => r.split(' '))
    .reduce((all, one) => [...all, ...one], []) // Flatten array
    .sort();

  return acts.reduce((actions, op) => {
    const updateAction = (name, val) =>
      (has(actions, name) ? { ...actions, [name]: val } : actions);

    if (op === '*') {
      return allowAll;
    }

    return (op[0] === '-') ?
      updateAction(op.slice(1), false) :
      updateAction(op, true);
  }, denyAll);
};

const allowAll = allow('*');
const denyAll = allow();

const SUPERADMIN = {
  accounts: allowAll,
  appointments: allowAll,
  chairs: allowAll,
  correspondences: allowAll,
  chats: allowAll,
  users: allowAll,

  deliveredProcedures: allowAll,

  listings: allow('read'),

  patients: allowAll,
  practitioners: allowAll,
  requests: allowAll,
  reviews: allow('read'),

  textMessages: allow('*', 'update'),

  services: allowAll,
  segments: allowAll,

  family: allowAll,

  syncClientError: allow('read', 'create'),
  syncClientVersion: allow('read', 'create'),
  syncClientControl: allow('create'),

  connectorVersion: allow('read', 'create'),

  timeOffs: allowAll,
  weeklySchedules: allowAll,
  dailySchedules: allowAll,

  enterprises: allowAll,
  sentReminders: allow('read'),
  sentRecalls: allow('read'),

  waitSpots: allowAll,
  table: allow('read'),
};

const OWNER = {
  ...SUPERADMIN,

  enterprises: denyAll,
};

const ADMIN = {
  ...OWNER,
};

const MANAGER = {
  ...ADMIN,
};

export default {
  SUPERADMIN,
  OWNER,
  MANAGER,
  ADMIN,
};
