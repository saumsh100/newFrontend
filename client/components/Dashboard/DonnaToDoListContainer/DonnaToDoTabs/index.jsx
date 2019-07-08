
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '../../../library';
import styles from './styles.scss';

class DonnaToDoTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineWidth: 23,
      divHeight: 0,
      startingPosition: 0,
      indexHeight: 0,
    };
  }

  componentDidMount() {
    const divHeight = document.getElementById('imageWrapper').clientHeight;
    const indexHeight = document.getElementById('toDoTab').clientHeight;
    const addToHeight = indexHeight * (this.props.toDoIndex + 1);
    const divideHeight = indexHeight / 2;
    const startingPosition = addToHeight - divideHeight;

    this.setState({
      startingPosition,
      divHeight: divHeight * 0.35,
      indexHeight,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.toDoIndex !== nextProps.toDoIndex) {
      const indexHeight = document.getElementById('toDoTab').clientHeight + 11;
      const addToHeight = indexHeight * (nextProps.toDoIndex + 1);
      const divideHeight = indexHeight / 2;
      const startingPosition = addToHeight - divideHeight;

      this.setState({
        startingPosition,
      });
    }
  }

  render() {
    let top = `${this.state.startingPosition}px`;

    let height = `${this.state.divHeight - this.state.startingPosition}px`;

    const lineStyle = {
      top: `${this.state.startingPosition}px`,
      left: 0,
      width: `${this.state.lineWidth}%`,
      height: '2px',
    };

    if (this.state.startingPosition > this.state.divHeight) {
      top = `${this.state.divHeight}px`;
      height = `${this.state.startingPosition - this.state.divHeight + 3}px`;
    }

    const lineStyle2 = {
      top,
      left: `${this.state.lineWidth}%`,
      width: '2px',
      height,
    };

    const lineStyle3 = {
      top: `${this.state.divHeight}px`,
      left: `${this.state.lineWidth}%`,
      width: '15%',
      height: '2px',
    };

    const lineStyle4 = {
      top: `${this.state.divHeight}px`,
      left: '65%',
      width: '20%',
      height: '2px',
    };

    const lineStyle5 = {
      top: `${this.state.divHeight}px`,
      left: '85%',
      width: '2px',
      height: `${this.state.indexHeight * 1.5}px`,
    };

    const multipleHeight = this.state.indexHeight * 1.5;
    const lineStyle6 = {
      top: `${this.state.divHeight + multipleHeight}px`,
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
              noUnderLine
            >
              <Tab
                label="Appointment Reminders"
                className={styles.tab}
                activeClass={styles.activeTab}
                id="toDoTab"
              />
              <Tab
                label="Patient Recalls"
                className={styles.tab}
                activeClass={styles.activeTab}
              />
              <Tab
                label="Review Requests"
                className={styles.tab}
                activeClass={styles.activeTab}
                data-test-id="reviewRequestsTab"
              />
            </Tabs>
          </div>

          <div className={styles.imageWrapper} id="imageWrapper">
            <img
              src="/images/donna.png"
              height="335px"
              width="338px"
              alt="Donna"
            />
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
