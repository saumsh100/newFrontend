import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isHub } from '../../../util/hub';
import styles from '../styles';
import Icon from '../Icon';
import { Button } from '..';
import { SContainer, SHeader, SBody, SFooter } from '../Layout/index';

class DialogBody extends Component {
  constructor(props) {
    super(props);
    this.deactivate = this.deactivate.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
  }

  deactivate(e) {
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }

  renderHeader() {
    const { title } = this.props;
    return (
      <SHeader className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.closeIcon} onClick={this.deactivate}>
          <Icon icon="times" />
        </div>
      </SHeader>
    );
  }

  renderFooter() {
    const { actions } = this.props;
    return (
      actions &&
      actions.length > 0 && (
        <SFooter className={styles.footer}>
          {actions.map((action) => {
            if (this.props['data-test-id']) {
              action.props = action.props || [];
              action.props['data-test-id'] = this.props['data-test-id'] + action.label;
            }

            return (
              <action.component
                key={`action_${action.label}`}
                onClick={action.onClick}
                className={classNames(styles.action, styles[action.type])}
                {...action.props}
              >
                {action.label}
              </action.component>
            );
          })}
        </SFooter>
      )
    );
  }

  render() {
    const { children, bodyStyles } = this.props;
    return (
      <SContainer data-test-id={this.props['data-test-id']}>
        {!isHub() && this.renderHeader()}
        <SBody className={classNames(styles.dialogBody, bodyStyles)}>{children}</SBody>
        {this.renderFooter()}
      </SContainer>
    );
  }
}

DialogBody.propTypes = {
  'data-test-id': PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
  onOverlayClick: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      props: PropTypes.shape({
        color: PropTypes.string,
        form: PropTypes.string,
      }),
    }),
  ),
  title: PropTypes.string.isRequired,
  bodyStyles: PropTypes.string,
};

DialogBody.defaultProps = {
  'data-test-id': undefined,
  actions: [],
  bodyStyles: undefined,
  children: null,
};

export default DialogBody;
