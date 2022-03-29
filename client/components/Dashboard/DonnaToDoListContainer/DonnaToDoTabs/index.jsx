import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tabs, Tab } from '../../../library';
import styles from '../../styles';

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
      <div className={styles.donnaTodoTabs_container}>
        <div className={styles.donnaTodoTabs_header}>Donna&apos;s To-Do List</div>
        <div className={styles.donnaTodoTabs_body}>
          <div className={styles.donnaTodoTabs_toDosList}>
            <Tabs
              index={this.props.toDoIndex}
              onChange={(i) => this.props.changeTab(i)}
              className={styles.donnaTodoTabs_tabs}
            >
              <Tab
                label="Appointment Reminders"
                className={styles.donnaTodoTabs_tab}
                activeClass={styles.donnaTodoTabs_activeTab}
              />
              <Tab
                label="Patient Recalls"
                className={styles.donnaTodoTabs_tab}
                activeClass={styles.donnaTodoTabs_activeTab}
              />
              <Tab
                label="Review Requests"
                className={styles.donnaTodoTabs_tab}
                activeClass={styles.donnaTodoTabs_activeTab}
                data-test-id="reviewRequestsTab"
              />
            </Tabs>
          </div>

          <div className={styles.donnaTodoTabs_imageWrapper}>
            <img src="/images/donna.png" height="335px" width="338px" alt="Donna" />
            <div
              className={classNames(
                styles.donnaTodoTabs_dynamicLines,
                styles.donnaTodoTabs_lineStyle,
              )}
            />
            <div
              className={classNames(
                styles.donnaTodoTabs_dynamicLines,
                styles.donnaTodoTabs_lineStyle2,
              )}
            />
            <div
              className={classNames(
                styles.donnaTodoTabs_dynamicLines,
                styles.donnaTodoTabs_lineStyle3,
              )}
            />
            <div
              className={classNames(
                styles.donnaTodoTabs_dynamicLines,
                styles.donnaTodoTabs_lineStyle4,
              )}
            />
            <div
              className={classNames(
                styles.donnaTodoTabs_dynamicLines,
                styles.donnaTodoTabs_lineStyle5,
              )}
            />
            <div
              className={classNames(
                styles.donnaTodoTabs_dynamicLines,
                styles.donnaTodoTabs_lineStyle6,
              )}
            />
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
