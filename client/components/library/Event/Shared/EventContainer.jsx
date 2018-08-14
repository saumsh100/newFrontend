
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from '../styles.scss';

export default function EventContainer(props) {
  const {
    headerData, subHeaderData, subHeaderItalicData, bodyStyle, component,
  } = props;

  const headerContent = <div className={styles.body_header}>{headerData}</div>;

  const subHeaderContent = <div className={styles.body_subHeader}>{subHeaderData}</div>;

  const subHeaderItalicContent = (
    <div className={styles.body_subHeaderItalic}>{subHeaderItalicData}</div>
  );

  return (
    <div className={classnames(styles.body, bodyStyle)}>
      {headerData && headerContent}
      {subHeaderData && subHeaderContent}
      {subHeaderItalicData && subHeaderItalicContent}
      {component}
    </div>
  );
}

EventContainer.propTypes = {
  headerData: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  subHeaderData: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  subHeaderItalicData: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  bodyStyle: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.string), PropTypes.string]),
  component: PropTypes.element,
};

EventContainer.defaultProps = {
  headerData: null,
  subHeaderData: null,
  subHeaderItalicData: null,
  component: null,
  bodyStyle: null,
};
