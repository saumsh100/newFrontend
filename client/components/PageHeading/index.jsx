
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { IconButton } from '../library';
import { TOOLBAR_LEFT, TOOLBAR_RIGHT } from '../../util/hub';
import { setBackHandler } from '../../reducers/electron';
import styles from './styles.scss';

const PageHeading = ({
  title, backHandler, toolbarPosition, ...props
}) => (
  <div
    className={classNames(styles.pageHeading, {
      [styles.borderTopRight]: toolbarPosition === TOOLBAR_LEFT,
      [styles.borderTopLeft]: toolbarPosition === TOOLBAR_RIGHT,
    })}
  >
    {backHandler && (
      <IconButton
        icon="arrow-left"
        className={styles.backButton}
        onClick={() => {
          props.setBackHandler(null);
          backHandler();
        }}
      />
    )}
    {typeof title === 'string' ? <p>{title}</p> : title}
  </div>
);

PageHeading.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  toolbarPosition: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_RIGHT]),
  backHandler: PropTypes.func,
  setBackHandler: PropTypes.func,
};

PageHeading.defaultProps = {
  title: null,
  toolbarPosition: TOOLBAR_LEFT,
  backHandler: null,
  setBackHandler: () => {},
};

function mapStateToProps({ electron }) {
  return {
    title: electron.get('title'),
    backHandler: electron.get('backHandler'),
    toolbarPosition: electron.get('toolbarPosition'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setBackHandler,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PageHeading);
