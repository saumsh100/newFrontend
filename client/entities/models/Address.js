
import { Record } from 'immutable';
import createModel from '../createModel';

const AddressSchema = {
  id: null,
  country: null,
  state: null,
  city: null,
  street: null,
  zipCode: null,
  phoneNumber: null,
  timezone: null,
};

export default class Address extends createModel(AddressSchema) {

}
