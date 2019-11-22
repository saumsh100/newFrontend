
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Tooltip from '../../Tooltip';
import Icon from '../Icon';
import styles from './styles.scss';

export default function Tab(props) {
  const {
    className,
    index,
    label,
    active,
    fluid,
    onClick,
    disabled,
    noUnderLine,
    activeClass,
    inactiveClass,
    id,
    tabCard,
    tooltipBody,
  } = props;

  let classes = !tabCard
    ? classNames(className, styles.tab)
    : classNames(className, styles.tabCard);
  if (active) {
    classes = !tabCard
      ? classNames(classes, activeClass, styles.activeTab)
      : classNames(classes, activeClass, styles.activeTabCard);
  } else {
    classes = classNames(classes, inactiveClass);
  }

  if (noUnderLine) {
    classes = classNames(classes, styles.noUnderLine);
  }

  if (disabled) {
    classes = classNames(classes, styles.disabledTab);
  }

  if (fluid) {
    classes = classNames(classes, styles.fluidTab);
  }

  return (
    // Order is important, classNames={classes} needs to override props.className
    // eslint-disable-next-line jsx-a11y/label-has-for
    <label
      className={classes}
      onClick={e => onClick(e, index)}
      data-test-id={props['data-test-id']}
      id={id}
    >
      {label}
      {tooltipBody && (
        <Tooltip body={tooltipBody} placement="below">
          <Icon icon="exclamation-circle" size={0.9} />
        </Tooltip>
      )}
    </label>
  );
}

Tab.propTypes = {
  className: PropTypes.string,
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  noUnderLine: PropTypes.bool,
  activeClass: PropTypes.string,
  inactiveClass: PropTypes.string,
  id: PropTypes.string,
  tabCard: PropTypes.bool,
  tooltipBody: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  'data-test-id': PropTypes.string,
};

Tab.defaultProps = {
  className: null,
  disabled: false,
  fluid: true,
  noUnderLine: false,
  activeClass: null,
  inactiveClass: null,
  id: null,
  tabCard: false,
  tooltipBody: undefined,
  index: null,
  active: false,
  onClick: undefined,
  'data-test-id': null,
};
