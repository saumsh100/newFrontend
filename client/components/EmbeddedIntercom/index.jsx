import React, { Component } from 'react';

class Intercom extends Component {
  componentDidMount() {
    this.setPosition();
    window.Intercom('show');

    const intercomContainer = document.getElementById('intercom-container');

    this.runWithinTimeout(() => {
      intercomContainer.classList.add('active');
    });

    window.Intercom('onHide', () => {
      intercomContainer.classList.remove('active');
    });
  }

  componentDidUpdate() {
    this.setPosition();
  }

  componentWillUnmount() {
    const intercomContainer = document.getElementById('intercom-container');
    intercomContainer.classList.remove('active');
  }

  setPosition() {
    const intercomContainer = document.getElementById('intercom-container');

    if (!intercomContainer.classList.contains('right')) {
      intercomContainer.classList.add('right');
    }
  }

  runWithinTimeout(callback) {
    setTimeout(callback, 100);
  }

  render() {
    return null;
  }
}

export default Intercom;
