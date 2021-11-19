import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import MainRegion from '../../../components/MainRegion';

function MainRegionContainer(props) {
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
