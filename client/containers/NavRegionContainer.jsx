
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import NavRegion from '../components/NavRegion';
import NavRegionElectron from '../components/NavRegion/Electron';
import { isHub } from '../util/hub';

function NavRegionContainer(props) {
  if (isHub()) {
    return <NavRegionElectron {...props}/>
  }
  return <NavRegion {...props}/>;
}

NavRegionContainer.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps({ toolbar }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
  };
}

const enhance = connect(mapStateToProps, null);

export default enhance(NavRegionContainer);
