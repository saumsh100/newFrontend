import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tabs, Tab } from '../../../library';
import styles from './styles.scss';

const OFFSET_HEIGHT = 37;

const INDEX_HEIGHT = 55.5875;

const setToDoTabLineStartingPosition = (toDoIndex) => {
  const scaledHeight = INDEX_HEIGHT * (toDoIndex + 1);
  const scaledOffsetHeight = toDoIndex * OFFSET_HEIGHT;
  const addToHeight = toDoIndex ? scaledHeight + scaledOffsetHeight : INDEX_HEIGHT;
  const divideHeight = INDEX_HEIGHT / 2;
  const startingPosition = addToHeight - divideHeight;

  return {
    startingPosition,
    toDoIndex,
  };
};

class DonnaToDoTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDoIndex: 0,
    };
  }

  componentDidMount() {
    this.setState(setToDoTabLineStartingPosition(this.props.toDoIndex));
  }

  static getDerivedStateFromProps(props, state) {
    if (state.toDoIndex !== props.toDoIndex) {
      return setToDoTabLineStartingPosition(props.toDoIndex);
    }

    return null;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>Donna&apos;s To-Do List</div>
        <div className={styles.body}>
          <div className={styles.toDosList}>
            <Tabs
              index={this.props.toDoIndex}
              onChange={(i) => this.props.changeTab(i)}
              className={styles.tabs}
            >
              <Tab
                label="Appointment Reminders"
                className={styles.tab}
                activeClass={styles.activeTab}
              />
              <Tab label="Patient Recalls" className={styles.tab} activeClass={styles.activeTab} />
              <Tab
                label="Review Requests"
                className={styles.tab}
                activeClass={styles.activeTab}
                data-test-id="reviewRequestsTab"
              />
            </Tabs>
          </div>

          <div className={styles.imageWrapper}>
            <img src="/images/donna.png" height="335px" width="338px" alt="Donna" />
            <div className={classNames(styles.dynamicLines, styles.lineStyle)} />
            <div className={classNames(styles.dynamicLines, styles.lineStyle2)} />
            <div className={classNames(styles.dynamicLines, styles.lineStyle3)} />
            <div className={classNames(styles.dynamicLines, styles.lineStyle4)} />
            <div className={classNames(styles.dynamicLines, styles.lineStyle5)} />
            <div className={classNames(styles.dynamicLines, styles.lineStyle6)} />
          </div>
        </div>
      </div>
    );
  }
}

DonnaToDoTabs.propTypes = {
  toDoIndex: PropTypes.number.isRequired,
  changeTab: PropTypes.func.isRequired,
};

export default DonnaToDoTabs;
