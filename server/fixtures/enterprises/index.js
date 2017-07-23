
import { v4 as uuid } from 'uuid';

const sunshineSmilesId = uuid();
const donnaDentalId = uuid();
const dsoId = uuid();
const testEnterprise1Id = '8805a729-e0d0-447c-b1bf-aa1cdfcbe0f5';
const testEnterpriseId = 'c5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

const testEnterprise = {
  id: testEnterpriseId,
  name: 'Test Enterprise',
};

export default [
  {
    id: sunshineSmilesId,
    name: 'Sunshine Smiles',
    plan: 'GROWTH',
  },
  {
    id: donnaDentalId,
    name: 'Donna Dental',
    plan: 'GROWTH',
  },
  {
    id: dsoId,
    name: 'Diamond Smile Organization',
    plan: 'ENTERPRISE',
  },
  {
    id: testEnterprise1Id,
    name: 'Test Enterprise 1',
    plan: 'GROWTH',
  },

  // API Tests...
  testEnterprise,
];

export {
  sunshineSmilesId,
  donnaDentalId,
  dsoId,
  testEnterprise,
};
