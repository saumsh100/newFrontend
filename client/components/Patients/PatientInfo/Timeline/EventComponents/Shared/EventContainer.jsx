
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '../../../../../library';
import styles from '../styles.scss';

export default function EventContainer(props) {
  const {
    headerData,
    subHeaderData,
    subHeaderItalicData,
    bodyStyle,
    component,
    onDelete,
    onEdit,
  } = props;

  const headerContent = onEdit ? (
    <button onClick={onEdit} className={classNames(styles.body_header, styles.body_editable)}>
      {headerData}
    </button>
  ) : (
    <div className={styles.body_header}>{headerData}</div>
  );
  const subHeaderContent = <div className={styles.body_subHeader}>{subHeaderData}</div>;
  const subHeaderItalicContent = (
    <div className={styles.body_subHeaderItalic}>{subHeaderItalicData}</div>
  );

  return (
    <div className={classNames(styles.body, bodyStyle)} role="button">
      {onDelete && (
        <button
          className={styles.trashIconWrapper}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Icon type="solid" icon="trash-alt" className={styles.trashIcon} />
        </button>
      )}

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
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  data: PropTypes.shape({}),
};

EventContainer.defaultProps = {
  headerData: null,
  subHeaderData: null,
  subHeaderItalicData: null,
  component: null,
  bodyStyle: null,
  onDelete: null,
  onEdit: null,
  data: null,
};
