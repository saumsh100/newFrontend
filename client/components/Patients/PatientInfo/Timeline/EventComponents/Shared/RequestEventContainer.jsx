
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import RequestPopoverLoader from '../../../../../library/RequestPopoverLoader';
import styles from '../styles.scss';

export default function RequestEventContainer({
  headerData,
  subHeaderData,
  subHeaderItalicData,
  bodyStyle,
  component,
  data,
}) {
  return (
    <div className={classNames(styles.body, bodyStyle)} role="button">
      <RequestPopoverLoader data={data}>
        <div className={styles.body_header}>{headerData}</div>
      </RequestPopoverLoader>

      {subHeaderData && <div className={styles.body_subHeader}>{subHeaderData}</div>}
      {subHeaderItalicData && (
        <div className={styles.body_subHeaderItalic}>{subHeaderItalicData}</div>
      )}
      {component}
    </div>
  );
}

RequestEventContainer.propTypes = {
  headerData: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  subHeaderData: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  subHeaderItalicData: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  bodyStyle: PropTypes.oneOfType([PropTypes.objectOf(PropTypes.string), PropTypes.string]),
  component: PropTypes.element,
  data: PropTypes.shape({}),
};

RequestEventContainer.defaultProps = {
  headerData: null,
  subHeaderData: null,
  subHeaderItalicData: null,
  component: null,
  bodyStyle: null,
  data: null,
};
