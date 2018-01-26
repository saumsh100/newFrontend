
export const convertPrimaryTypesToKey = (primaryTypes) => {
  return primaryTypes.sort((a, b) => a > b).join('_');
};

