
const url = fileName => `https://s3-us-west-2.amazonaws.com/carecru-staging/dev/demo/${fileName}`;

const DEMO_AVATAR_URLS = {
  female: {
    6: url('demo024.jpg'),
    8: url('demo025.jpg'),
    18: url('demo014.jpg'),
    20: url('demo016.jpg'),
    22: url('demo020.jpg'),
    24: url('demo008.jpg'),
    26: url('demo018.jpg'),
    28: url('demo029.jpg'),
    30: url('demo033.jpg'),
    32: url('demo022.jpg'),
    34: url('demo005.jpg'),
    36: url('demo034.jpg'),
    38: url('demo007.jpg'),
    40: url('demo010.jpg'),
    42: url('demo036.jpg'),
    46: url('demo012.jpg'),
    70: url('demo002.jpg'),
    76: url('demo027.jpg'),
  },

  male: {
    6: url('demo035.jpg'),
    8: url('demo009.jpg'),
    10: url('demo003.jpg'),
    18: url('demo011.jpg'),
    24: url('demo019.jpg'),
    30: url('demo006.jpg'),
    36: url('demo004.jpg'),
    38: url('demo031.jpg'),
    40: url('demo017.jpg'),
    42: url('demo030.jpg'),
    46: url('demo013.jpg'),
    50: url('demo015.jpg'),
    58: url('demo026.jpg'),
    60: url('demo032.jpg'),
    64: url('demo001.jpg'),
    66: url('demo021.jpg'),
    70: url('demo002.jpg'),
    72: url('demo023.jpg'),
  },
};

const flattenAges = (set) => {
  const flatArray = [];

  const numbers = Object.keys(set);
  let floor = 0;
  for (let i = 0; i < numbers.length; i++) {
    const ciel = numbers[i];
    for (let j = floor; j <= ciel; j++) {
      flatArray[j] = set[ciel];
    }

    // swap so next iteration works
    floor = ciel;
  }

  const lastNumber = numbers[numbers.length - 1];
  for (let i = lastNumber; i <= 120; i++) {
    flatArray[i] = set[lastNumber];
  }

  return flatArray;
};

export const male = flattenAges(DEMO_AVATAR_URLS.male);
export const female = flattenAges(DEMO_AVATAR_URLS.female);
