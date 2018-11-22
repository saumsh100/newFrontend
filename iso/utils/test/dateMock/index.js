
/**
 * dateMock
 * test util for mocking the date object
 * @param {string} date to be mocked in iso format, it will be base date for the date class
 * @returns {Date} mocked date object
 */
export default (date = '2017-11-16T08:00:00.000Z') => {
  let originalDate;
  beforeEach(() => {
    originalDate = Date;
    const fixedDate = new Date(date);
    global.Date = class extends Date {
      constructor() {
        super();
        return fixedDate;
      }
    };
  });

  afterEach(() => {
    global.Date = originalDate;
  });
};
