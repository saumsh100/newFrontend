
import { v4 as uuid } from 'uuid';
import faker from 'faker';
import uniqWith from 'lodash/uniqWith';
import {
  generateUniqueWithPredicate,
} from '../../../../server/models/createModel/unique';

const accountId = uuid();
const makeSeeds = () => ([
  { accountId, name: 'a', email: 'a@me.ca' },
  { accountId, name: 'b', email: 'b@me.ca' },
]);

const uniqConfig = {
  name: ['accountId'],
  email: ['accountId'],
};

describe('createModel/unique Helpers', () => {
  describe('#generateUniqueWithPredicate', () => {
    test('should return the array', () => {
      const seeds = uniqWith(makeSeeds(), generateUniqueWithPredicate(uniqConfig));
      expect(seeds.length).toBe(2);
    });

    test('should return only 1 for same name & same accountId', () => {
      const seeds = makeSeeds();
      seeds[1].name = seeds[0].name;

      const s = uniqWith(seeds, generateUniqueWithPredicate(uniqConfig));
      expect(s.length).toBe(1);
    });

    test('should return 2 for same name but different accountId', () => {
      const seeds = makeSeeds();
      seeds[1].name = seeds[0].name;
      seeds[1].accountId = 'cat';

      const s = uniqWith(seeds, generateUniqueWithPredicate(uniqConfig));
      expect(s.length).toBe(2);
    });
  });
});
