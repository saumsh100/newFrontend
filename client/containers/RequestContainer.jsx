import React, { PropTypes } from 'react';
import Requests from '../components/Requests';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../thunks/fetchEntities';


class RequestContainer extends React.Component{

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.fetchEntities({ key: 'requests' });
  }

  render() {
    return (
      <div>
        <Requests requests={this.props.requests} />
      </div>
    );
  }
}

RequestContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return { requests: entities.get('requests') };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(RequestContainer);

