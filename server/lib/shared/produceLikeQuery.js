
/**
 * produceLikeQuery is a function that will produce a query to check
 * if an attribute matches any of the supplied patterns
 *
 * @param patterns - array of strings
 * @return whereQueryObject - {object}
 */
export default function produceLikeQuery(patterns) {
  return {
    $or: patterns.map(
      pattern => (
        { $like: pattern }
      )
    ),
  };
}
