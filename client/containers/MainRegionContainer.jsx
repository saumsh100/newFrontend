
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MainRegion from '../components/MainRegion';
import MainRegionElectron from '../components/MainRegion/Electron';
import { isHub } from '../util/hub';

function MainRegionContainer(props) {
  if (isHub()) {
    return <MainRegionElectron {...props} />;
  }
  return <MainRegion {...props} />;
}

MainRegionContainer.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps({ toolbar }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
  };
}

const enhance = connect(mapStateToProps, null);

export default enhance(MainRegionContainer);
