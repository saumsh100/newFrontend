
export function generateUniqueWithPredicate(uniqueConfig, onError) {
  let pred = (c, d) => {
    if (c.id && d.id && (c.id === d.id)) {
      onError && onError('id');
      return true;
    }
  };

  const isSame = (c, d) => {
    if (c.id && d.id && (c.id === d.id)) {
      onError && onError('id');
      return true;
    }



    return (c.accountId === d.accountId && c.email === d.email) ||
      (c.accountId === d.accountId && c.name === d.name);
  };

  return (a, b) => {
    return isSame(a, b);
  };
}
