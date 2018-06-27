
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../library';
import { electron } from '../../../util/ipc';
import { OPEN_EXTERNAL_LINK } from '../../../constants';
import styles from './styles.scss';

class SingleShortcut extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    electron.send(OPEN_EXTERNAL_LINK, this.props.link);
  }

  render() {
    const { label } = this.props;
    return (
      <div className={styles.wrapper} onClick={this.onClick}>
        <span>{label}</span>
        <Icon size={1.6} icon="external-link" className={styles.icon} />
      </div>
    );
  }
}

SingleShortcut.propTypes = {
  link: PropTypes.string,
  label: PropTypes.string,
};

export default SingleShortcut;
