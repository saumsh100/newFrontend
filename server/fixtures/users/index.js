/**
 * Created by gavin on 2017-07-18.
 */

import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../config/globals';

const testUserId = 'b167f8a1-b48b-474c-85de-d47f7deff3de';
const testPhoneNumber = '6048888888';
const testAccount1Id = '7a046392-3c49-4268-953b-9163ae4291f5';
const testEnterprise1Id = '8805a729-e0d0-447c-b1bf-aa1cdfcbe0f5';
const testPermission1Id = 'daefb629-6fd2-4c01-973b-16404db01be3';

export default [
  {
    id: testUserId,
    username: 'test@carecru.com',
    password: bcrypt.hashSync('asdzxcqwe', passwordHashSaltRounds),
    firstName: 'Testly',
    lastName: 'Testerson',
    phoneNumber: testPhoneNumber,
    activeAccountId: testAccount1Id,
    enterpriseId: testEnterprise1Id,
    permissionId: testPermission1Id,
  },
];
