'use strick';

/* eslint-disable camelcase */
import {
  LAST_30_DAYS,
  LAST_7_DAYS,
  LAST_MONTH,
  LAST_QUARTER,
  LAST_WEEK,
  LAST_YEAR,
  MONTH,
  MTD,
  QTD,
  QUARTER,
  TOMORROW,
  WEEK,
  WTD,
  YEAR,
  YESTERDAY,
  YTD,
} from './dictionary';
import {
  last_30_days,
  last_7_days,
  last_month,
  last_quarter,
  last_week,
  last_year,
  month,
  mtd,
  qtd,
  quarter,
  tomorrow,
  week,
  wtd,
  year,
  yesterday,
  ytd,
} from './ranges';

const defaultList = date => ({
  [YESTERDAY]: yesterday(date),
  [TOMORROW]: tomorrow(date),
  [WEEK]: week(date),
  [MONTH]: month(date),
  [YEAR]: year(date),
  [YTD]: ytd(date),
  [QTD]: qtd(date),
  [WTD]: wtd(date),
  [MTD]: mtd(date),
  [QUARTER]: quarter(date),
  [LAST_WEEK]: last_week(date),
  [LAST_MONTH]: last_month(date),
  [LAST_QUARTER]: last_quarter(date),
  [LAST_YEAR]: last_year(date),
  [LAST_7_DAYS]: last_7_days(date),
  [LAST_30_DAYS]: last_30_days(date),
});

export default defaultList;
