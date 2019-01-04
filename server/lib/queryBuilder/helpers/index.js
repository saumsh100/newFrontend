
/**
 * Generate a query for a given request object. Use comparators and operators object to translate
 * the request into the query.
 * @param requestObject
 * @param {Object} comparators abstract comparators list
 * @param {Object} operators raw operators list
 */
export default (requestObject, comparators, operators) => {
  const queries = Object.entries(requestObject)
    .map(([operator, value]) => {
      if (!comparators[operator] && !operators[operator]) {
        throw new Error(`Operator ${operator} is not supported.`);
      }
      const comparator = comparators[operator] || operator;
      return typeof comparator === 'function'
        ? comparator(value)
        : { [comparator]: value };
    });

  return { $and: queries };
};
