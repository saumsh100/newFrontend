
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TopBar from '../components/TopBar';
import { setIsCollapsed } from '../actions/toolbar';

function TopBarContainer(props) {
  return <TopBar {...props}/>;
}

TopBarContainer.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

function mapStateToProps({ toolbar }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
  };
}

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    setIsCollapsed,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(TopBarContainer);
