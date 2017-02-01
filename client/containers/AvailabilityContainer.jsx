
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';

class Availability extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.fetchEntities({ key: 'availabilities' });
  }



  render() {
    return (
      <div>
        Hello
      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  return {
    availabilities: entities.get('availabilities'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Availability);
