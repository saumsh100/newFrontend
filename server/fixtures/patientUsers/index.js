
// Tomorrow at 8 o clock
// const startDate = new Date(2017, 5, 1, 8, 0);

import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { passwordHashSaltRounds } from '../../config/globals';

export const patientUserId = uuid();

export default [
  {
    id: patientUserId,
    email: 'justin.d.sharp@gmail.com',
    password: bcrypt.hashSync('justin', passwordHashSaltRounds),
    firstName: 'Justine',
    lastName: 'Franco',
    phoneNumber: '+1231231233',
  },
];
