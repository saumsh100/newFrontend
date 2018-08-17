
export function inputTheme(input) {
  return {
    bar: input.bar,
    error: input.error,
    erroredInput: input.erroredInput,
    erroredLabel: input.erroredLabel,
    erroredLabelFilled: input.erroredLabelFilled,
    filled: input.filled,
    group: input.group,
    iconClassName: input.validationIcon,
    input: input.input,
    inputWithIcon: input.inputWithIcon,
    label: input.label,
    disabled: input.disabled,
    disabledGroup: input.disabledGroup,
  };
}
export function inputTextarea(input) {
  return {
    bar: input.bar,
    error: input.error,
    erroredInput: input.erroredInput,
    erroredLabel: input.erroredLabel,
    erroredLabelFilled: input.erroredLabelFilled,
    filled: input.filled,
    group: input.group,
    iconClassName: input.validationIcon,
    input: input.textarea,
    inputWithIcon: input.inputWithIcon,
    label: input.label,
    labelWrapper: input.labelWrapper,
  };
}
export function dropdownTheme(dropdown) {
  return {
    active: dropdown.inputActive,
    bar: dropdown.bar,
    caretIconWrapper: dropdown.caretIconWrapper,
    error: dropdown.erroredLabelDropdown,
    erroredLabel: dropdown.erroredLabel,
    erroredLabelFilled: dropdown.erroredLabelFilled,
    errorIcon: dropdown.errorIcon,
    errorToggleDiv: dropdown.erroredDropdown,
    filled: dropdown.filled,
    input: dropdown.input,
    label: dropdown.label,
    toggleDiv: dropdown.input,
    wrapper: dropdown.wrapper,
    slotButton: dropdown.dataSlot,
    selectedListItem: dropdown.selectedListItem,
  };
}
