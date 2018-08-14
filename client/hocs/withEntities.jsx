
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntitiesRequest } from '../thunks/fetchEntities';

/**
 * withEntitiesRequest is a HOC that gives a BasicComponent
 * its requested entities, as well as the apiRequest model
 * to access isFetching props
 * {
 *    isHovered: BOOLEAN,
 * }
 * @param BasicComponent
 * @returns BasicComponent with the new props
 */
export default function withEntitiesRequest(data) {
  return (BasicComponent) => {
    class LoadedComponent extends Component {
      componentDidMount() {
        this.props.fetchEntitiesRequest(data);
      }

      render() {
        return <BasicComponent {...this.props} />;
      }
    }

    LoadedComponent.propTypes = {
      fetchEntitiesRequest: PropTypes.func.isRequired,
      [data.key]: PropTypes.object.isRequired,
      isFetching: PropTypes.bool.isRequired,
      apiRequest: PropTypes.object,
    };

    function mapStateToProps({ entities, apiRequests }) {
      const apiRequest = apiRequests.get(data.id);
      const isFetching = !!apiRequest && apiRequest.get('isFetching');
      return {
        isFetching,
        apiRequest,
        [data.key]: entities.get(data.key),
      };
    }

    function mapDispatchToProps(dispatch) {
      return bindActionCreators(
        {
          fetchEntitiesRequest,
        },
        dispatch,
      );
    }

    return connect(
      mapStateToProps,
      mapDispatchToProps,
    )(LoadedComponent);
  };
}
