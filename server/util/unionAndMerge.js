
import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';
import toArray from 'lodash/toArray';

export default function unionAndMerge(arrA, arrB, key = 'id') {
  const mapA = keyBy(arrA, key);
  const mapB = keyBy(arrB, key);
  const mergedMap = merge(mapA, mapB);
  return toArray(mergedMap);
}
