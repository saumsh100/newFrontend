
import { getOffsetWithDefault, offsetToCursor } from 'graphql-relay';

/**
 * A simple function that accepts an array and connection arguments, and returns
 * a connection object for use in GraphQL
 *
 * This is a fork of connectionFromArraySlice
 * from https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js#L65
 *
 * Diferente form the original, is this case we build the cursor and pageInfo based on args
 * whitout slicing the array.
 * That way we can pass the already sliced or filtered array to the function.
 *
 * For now, this only works with forward pagination.
 */
// eslint-disable-next-line import/prefer-default-export
export function connectionFromArrayWithoutSlice(array, args, meta) {
  const { after, first, last } = args;
  const { arrayLength } = meta;

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }
  }

  const afterOffset = getOffsetWithDefault(after, 0);

  const startOffset = Math.max(afterOffset, -1) + 1;
  const endOffset = startOffset + first;

  const edges = array.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = arrayLength;

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: typeof last === 'number' ? startOffset > lowerBound : false,
      hasNextPage: typeof first === 'number' ? endOffset < upperBound : false,
    },
  };
}
