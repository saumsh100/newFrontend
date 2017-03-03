
// OS of the computer will add timezone to this function
module.exports = {
  time: (hours, minutes) => {
    return new Date(1970, 1, 0, hours, minutes);
  },
};
