
import { v4 as uuid } from 'uuid';

const sunshineSmilesId = uuid();
const donnaDentalId = uuid();
const dsoId = uuid();

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
];

export {
  sunshineSmilesId,
  donnaDentalId,
  dsoId,
};
