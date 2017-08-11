const moment = require('moment');

console.log(moment().add(-10, 'years').startOf('year').toISOString(), new Date(1999, 1, 31), moment().endOf("year"), moment().startOf("year"));
