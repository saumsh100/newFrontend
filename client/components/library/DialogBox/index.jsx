
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import CardHeader from '../CardHeader';
import Icon from '../Icon';
import Modal from '../Modal';
import { SContainer, SHeader, SBody, SFooter } from '../Layout/index';

class DialogBox extends Component {
  constructor(props) {
    super(props);
    this.deactivate = this.deactivate.bind(this);
  }

  deactivate(e) {
    this.props.onOverlayClick && this.props.onOverlayClick(e);
  }

  render() {
    const {
      children,
      actions,
      title,
      bodyStyles,
    } = this.props;

    let showFooterComponent = null;
    if (actions && actions.length) {
      showFooterComponent = (
        <SFooter className={styles.footer}>
          {actions.map((action, index) => {
            if (this.props['data-test-id']) {
              action.props = action.props || [];
              action.props['data-test-id'] = this.props['data-test-id'] + action.label;
            }

            return (
              <action.component
                key={`action_${index}`}
                onClick={action.onClick}
                className={styles.action}
                {...action.props}
              >
                {action.label}
              </action.component>
            );
          })}
        </SFooter>
      );
    }

    return (
      <Modal {...this.props}>
        <SContainer
          data-test-id={this.props['data-test-id']}
        >
          <SHeader className={styles.header}>
            <div className={styles.title}>
              {title}
            </div>
            <div
              className={styles.closeIcon}
              onClick={this.deactivate}
            >
              <Icon icon="times" />
            </div>
          </SHeader>
          <SBody className={classNames(styles.dialogBody, bodyStyles)}>
            {children}
          </SBody>
          {showFooterComponent}
        </SContainer>
      </Modal>
    );
  }
}

DialogBox.propTypes = {
  children: PropTypes.object,
};

export default DialogBox;
