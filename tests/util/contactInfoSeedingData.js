
import { Patient, Family } from 'CareCruModels';

export const clone = obj => Object.assign({}, obj);
export const date = (m, d, age = 1) => new Date(2018 - age, m, d);

const Dad = new Patient({
  firstName: 'Dad',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 39),
  pmsCreatedAt: date(1, 1),
  status: 'Active',
  accountId: 1,
});
const Mom = new Patient({
  firstName: 'Mom',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 38),
  pmsCreatedAt: date(1, 1),
  status: 'Inactive',
  accountId: 1,
});
const Grandma = new Patient({
  firstName: 'Grandma',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 68),
  pmsCreatedAt: date(1, 1),
  status: 'Active',
  accountId: 1,
});
const Son = new Patient({
  firstName: 'Son',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 5),
  pmsCreatedAt: date(1, 1),
  status: 'Active',
  accountId: 1,
});
const Daughter = new Patient({
  firstName: 'Daughter',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 10),
  pmsCreatedAt: date(1, 1),
  status: 'Active',
  accountId: 1,
});
const BigSis = new Patient({
  firstName: 'BigSis',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 22),
  pmsCreatedAt: date(1, 1),
  status: 'Active',
  accountId: 1,
});
const Nephew = new Patient({
  firstName: 'Nephew',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 17),
  pmsCreatedAt: date(1, 1),
  status: 'Inactive',
  accountId: 1,
});
const Sister = new Patient({
  firstName: 'Sister',
  cellPhoneNumber: '+12223334444',
  birthDate: date(1, 1, 15),
  pmsCreatedAt: date(1, 1),
  status: 'Inactive',
  accountId: 1,
});

const jonesFamily = new Family({
  pmsCreatedAt: date(1, 1),
  accountId: 1,
});

const jackFamily = new Family({
  pmsCreatedAt: date(1, 2),
  accountId: 1,
});

export const lonePatient = () => [
  new Patient({
    firstName: 'Forever Alone',
    cellPhoneNumber: '+12223334444',
    birthDate: date(1, 1, 15),
    pmsCreatedAt: date(1, 1),
    status: 'Inactive',
    accountId: 1,
  }),
];

export const scenario1 = () => {
  const fetchedPatients = [Dad, Mom, Son, Daughter];

  jonesFamily.headId = fetchedPatients.find(p => p.firstName === 'Mom').id;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario2 = () => {
  const fetchedPatients = [Dad, Grandma, Son, Daughter];

  jonesFamily.headId = fetchedPatients.find(p => p.firstName === 'Dad').id;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario3 = () => {
  const fetchedPatients = [Dad, Grandma, Son, Daughter];

  jonesFamily.headId = null;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario4 = () => {
  const fetchedPatients = [Mom, Son, Daughter];

  jonesFamily.headId = fetchedPatients.find(p => p.firstName === 'Mom').id;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario5 = () => {
  const fetchedPatients = [Mom, Grandma, Son, Daughter];

  jonesFamily.headId = null;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario6 = () => {
  const fetchedPatients = [Mom, Grandma, Son, Daughter];

  jonesFamily.headId = fetchedPatients.find(p => p.firstName === 'Grandma').id;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario7 = () => {
  Dad.status = 'Inactive';
  let jones = [Mom, Grandma, Son, Daughter];
  let jack = [Dad, BigSis];

  jonesFamily.headId = jones.find(p => p.firstName === 'Mom').id;
  jones = jones.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });

  jackFamily.headId = jack.find(p => p.firstName === 'Dad').id;
  jack = jack.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });

  return [...jones, ...jack];
};

export const scenario8 = () => {
  const fetchedPatients = [Grandma, Son, Daughter];

  jonesFamily.headId = null;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};

export const scenario9 = () => {
  const fetchedPatients = [Nephew, Sister];

  jonesFamily.headId = null;
  return fetchedPatients.map((p) => {
    p.family = jonesFamily;
    p.familyId = jonesFamily.id;
    return p;
  });
};
