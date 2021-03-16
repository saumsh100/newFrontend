'use strict';

/* eslint-disable camelcase */

export const last_7_days = date => ({
  label: 'Last 7 Days',
  start: date
    .clone()
    .subtract(7, 'day')
    .toDate(),
  end: date.clone().toDate(),
});

export const last_30_days = date => ({
  label: 'Last 30 Days',
  start: date
    .clone()
    .subtract(30, 'day')
    .toDate(),
  end: date.clone().toDate(),
});

export const last_month = date => ({
  label: 'Last Month',
  start: date
    .clone()
    .subtract(1, 'month')
    .startOf('month')
    .toDate(),
  end: date
    .clone()
    .subtract(1, 'month')
    .endOf('month')
    .toDate(),
});

export const last_quarter = date => ({
  label: 'Last Quarter',
  start: date
    .clone()
    .subtract(1, 'quarter')
    .startOf('quarter')
    .toDate(),
  end: date
    .clone()
    .subtract(1, 'quarter')
    .endOf('quarter')
    .toDate(),
});

export const last_week = date => ({
  label: 'Last Week',
  start: date
    .clone()
    .subtract(1, 'week')
    .startOf('week')
    .toDate(),
  end: date
    .clone()
    .subtract(1, 'week')
    .endOf('week')
    .toDate(),
});

export const last_year = date => ({
  label: 'Last Year',
  start: date
    .clone()
    .subtract(1, 'year')
    .startOf('year')
    .toDate(),
  end: date
    .clone()
    .subtract(1, 'year')
    .endOf('year')
    .toDate(),
});

export const month = date => ({
  label: 'This Month',
  start: date
    .clone()
    .startOf('month')
    .toDate(),
  end: date
    .clone()
    .endOf('month')
    .toDate(),
});

export const mtd = date => ({
  label: 'Month to Date',
  start: date
    .clone()
    .startOf('month')
    .toDate(),
  end: date.clone().toDate(),
});

export const qtd = date => ({
  label: 'Quarter to Date',
  start: date
    .clone()
    .startOf('quarter')
    .toDate(),
  end: date.clone().toDate(),
});

export const quarter = date => ({
  label: 'This Quarter',
  start: date
    .clone()
    .startOf('quarter')
    .toDate(),
  end: date
    .clone()
    .endOf('quarter')
    .toDate(),
});

export const tomorrow = date => ({
  label: 'Tomorrow',
  start: date.clone().toDate(),
  end: date
    .clone()
    .add(1, 'day')
    .toDate(),
});

export const week = date => ({
  label: 'This Week',
  start: date
    .clone()
    .startOf('week')
    .toDate(),
  end: date
    .clone()
    .endOf('week')
    .toDate(),
});

export const wtd = date => ({
  label: 'Week to Date',
  start: date
    .clone()
    .startOf('week')
    .toDate(),
  end: date.clone().toDate(),
});

export const year = date => ({
  label: 'This Year',
  start: date
    .clone()
    .startOf('year')
    .toDate(),
  end: date
    .clone()
    .endOf('year')
    .toDate(),
});

export const yesterday = date => ({
  label: 'Yesterday',
  start: date
    .clone()
    .subtract(1, 'day')
    .toDate(),
  end: date.clone().toDate(),
});

export const ytd = date => ({
  label: 'Year to Date',
  start: date
    .clone()
    .startOf('year')
    .toDate(),
  end: date.clone().toDate(),
});
