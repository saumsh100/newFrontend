
/**
 * Creates a refetcher handler thats used to refetch already existing Query data when new
 * subscription event occurs.
 * @param subscribeToMore {function} obtained via Query callback function
 * @param refetch {function} obtained via Query callback function, used to refetch current query
 * @param variables {object} used to forward it to the subscription query (gQL input variables)
 * @return {function(*=): *}
 */
export default (subscribeToMore, refetch, variables) => subscription =>
  subscribeToMore({
    document: subscription,
    variables,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      return refetch();
    },
  });
