
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '../../../library';
import styles from './styles.scss';

const OFFSET_HEIGHT = 37;

const INDEX_HEIGHT = 55.5875;
const DIV_HEIGHT = 335 / 3;
class DonnaToDoTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineWidth: 23,
      startingPosition: 0,
    };
  }

  componentDidMount() {
    this.setToDoTabLineStartingPosition(this.props.toDoIndex);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.toDoIndex !== nextProps.toDoIndex) {
      this.setToDoTabLineStartingPosition(nextProps.toDoIndex);
    }
  }

  setToDoTabLineStartingPosition(toDoIndex) {
    const scaledHeight = INDEX_HEIGHT * (toDoIndex + 1);
    const scaledOffsetHeight = toDoIndex * OFFSET_HEIGHT;
    const addToHeight = toDoIndex ? scaledHeight + scaledOffsetHeight : INDEX_HEIGHT;
    const divideHeight = INDEX_HEIGHT / 2;
    const startingPosition = addToHeight - divideHeight;
    this.setState({
      startingPosition,
    });
  }

  render() {
    let top = `${this.state.startingPosition}px`;

    let height = `${DIV_HEIGHT - this.state.startingPosition}px`;

    const lineStyle = {
      top: `${this.state.startingPosition}px`,
      left: 0,
      width: `${this.state.lineWidth}%`,
      height: '2px',
    };

    if (this.state.startingPosition > DIV_HEIGHT) {
      top = `${DIV_HEIGHT}px`;
      height = `${this.state.startingPosition - DIV_HEIGHT + 2}px`;
    }

    const lineStyle2 = {
      top,
      left: `${this.state.lineWidth}%`,
      width: '2px',
      height,
    };

    const lineStyle3 = {
      top: `${DIV_HEIGHT}px`,
      left: `${this.state.lineWidth}%`,
      width: '15%',
      height: '2px',
    };

    const lineStyle4 = {
      top: `${DIV_HEIGHT}px`,
      left: '65%',
      width: '20%',
      height: '2px',
    };

    const lineStyle5 = {
      top: `${DIV_HEIGHT}px`,
      left: '85%',
      width: '2px',
      height: `${INDEX_HEIGHT * 1.5}px`,
    };

    const multipleHeight = INDEX_HEIGHT * 1.5;
    const lineStyle6 = {
      top: `${DIV_HEIGHT + multipleHeight}px`,
      left: '85%',
      width: '15%',
      height: '2px',
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>Donna&apos;s To-Do List</div>
        <div className={styles.body}>
          <div className={styles.toDosList}>
            <Tabs
              index={this.props.toDoIndex}
              onChange={i => this.props.changeTab(i)}
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
            <div style={lineStyle} className={styles.dynamicLines}>
              {''}
            </div>
            <div style={lineStyle2} className={styles.dynamicLines}>
              {''}
            </div>
            <div style={lineStyle3} className={styles.dynamicLines}>
              {''}
            </div>
            <div style={lineStyle4} className={styles.dynamicLines}>
              {''}
            </div>
            <div style={lineStyle5} className={styles.dynamicLines}>
              {''}
            </div>
            <div style={lineStyle6} className={styles.dynamicLines}>
              {''}
            </div>
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
