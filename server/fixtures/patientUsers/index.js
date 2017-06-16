
// Tomorrow at 8 o clock
// const startDate = new Date(2017, 5, 1, 8, 0);

import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { passwordHashSaltRounds } from '../../config/globals';

export const patientUserId = uuid();
export const patientUserId2 = uuid();
export const patientUserId3 = uuid();

const justinPhoneNumber = '+17808508886';
const alexPhoneNumber = '+19782521845';
const markPhoneNumber = '+17788654451';

export default [
  {
    id: patientUserId,
    email: 'justin@carecru.com',
    password: bcrypt.hashSync('justin', passwordHashSaltRounds),
    firstName: 'Justine',
    lastName: 'Franco',
    phoneNumber: alexPhoneNumber,
  },
  {
    id: patientUserId2,
    firstName: 'Mark',
    lastName: 'Joseph',
    email: 'mark@carecru.com',
    phoneNumber: markPhoneNumber,
    password: bcrypt.hashSync('mark', passwordHashSaltRounds),
  },
  {
    id: patientUserId3,
    firstName: 'Justin',
    lastName: 'Sharp',
    email: 'justin@carecru.com',
    phoneNumber: justinPhoneNumber,
    password: bcrypt.hashSync('justin', passwordHashSaltRounds),
  },
];
