
import React, { PropTypes, Component } from 'react';
import styles from './styles.scss';
import CardHeader from '../CardHeader';
import Modal from '../Modal';

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
    } = this.props;

    let showFooterComponent = null;
    if (actions) {
      showFooterComponent = (
        <div className={styles.dialogBody__footer}>
          {actions.map((action, index) => {
            if (this.props['data-test-id']) {
              action.props = action.props || [];
              action.props['data-test-id'] = this.props['data-test-id'] + action.label;
            }

            return (
              <action.component
                key={`action_${index}`}
                onClick={action.onClick}
                className={styles.dialogBody__action}
                {...action.props}
              >
                {action.label}
              </action.component>
            );
          })}
        </div>
      );
    }

    return (
      <Modal {...this.props}>
        <div
          className={styles.dialogBody}
          data-test-id={this.props['data-test-id']}
        >
          <div className={styles.dialogBody__header}>
            <CardHeader title={title} />
            <div
              className={styles.dialogBody__closeIcon}
              onClick={this.deactivate}
            >
              x
            </div>
          </div>
          {children}
          {showFooterComponent}
        </div>
      </Modal>
    );
  }
}

DialogBox.propTypes = {
  children: PropTypes.object,
};

export default DialogBox;
