
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TOOLBAR_LEFT, TOOLBAR_RIGHT } from '../../util/hub';

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

    if (
      !intercomContainer.classList.contains('right') &&
      this.props.toolbarPosition === TOOLBAR_RIGHT
    ) {
      intercomContainer.classList.add('right');
    }

    if (this.props.toolbarPosition === TOOLBAR_LEFT) {
      intercomContainer.classList.remove('right');
    }
  }

  runWithinTimeout(callback) {
    setTimeout(callback, 100);
  }

  render() {
    return null;
  }
}

Intercom.propTypes = {
  toolbarPosition: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_RIGHT]).isRequired,
};

const mapStateToProps = ({ electron }) => ({
  toolbarPosition: electron.get('toolbarPosition'),
});

export default connect(mapStateToProps)(Intercom);
