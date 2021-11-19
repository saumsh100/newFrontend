import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import NavRegion from '../../../components/NavRegion';

function NavRegionContainerV2(props) {
  return <NavRegion {...props} />;
}

NavRegionContainerV2.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

function mapStateToProps({ toolbar }) {
  return {
    isCollapsed: toolbar.get('isCollapsed'),
  };
}

const enhance = connect(mapStateToProps, null);

export default enhance(NavRegionContainerV2);
