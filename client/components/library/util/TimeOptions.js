
import moment from 'moment';

const generateTimeOptions = () => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 60;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i += 1) {
    let j;
    for (j = 0; j < increments; j += 1) {
      const time = moment(new Date(1970, 0, 1, i, j * increment));
      const value = time.toISOString();
      const label = time.format('LT');
      timeOptions.push({
        value,
        label,
      });
    }
  }

  return timeOptions;
};

export const timeOptions = generateTimeOptions();

export const setTime = (time) => {
  const tempTime = new Date(time);
  const mergeTime = new Date(1970, 0, 1);
  mergeTime.setDate(mergeTime.getDate());
  mergeTime.setHours(tempTime.getHours());
  mergeTime.setMinutes(tempTime.getMinutes());
  return mergeTime.toISOString();
};

export const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};
