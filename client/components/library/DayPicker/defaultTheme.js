import styles from './reskin-dayPicker.scss';

export const dayPickerTheme = styles;

export const rangePickerTheme = {
  ...dayPickerTheme,
  months: styles.rangePickerMonths,
  month: styles.rangePickerMonth,

  selected: styles.rangePickerDaySelected,
  disabled: styles.rangePickerDayDisabled,
  today: styles.today,
};
