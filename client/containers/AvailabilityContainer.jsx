
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntities } from '../thunks/fetchEntities';

class Availability extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'practitioners' });
    this.props.fetchEntities({ key: 'services' });
  }


  render() {
    return (
      <div>
        <ul>
          {this.props.services.map(s =>
            <li>{s}</li>
          )}
        </ul>
        <ul>
          {this.props.practitioners.map(p =>
            <li>{p}</li>
          )}
        </ul>
        Hello
      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  return {
    availabilities: entities.get('availabilities'),
    services: entities.get('services'),
    practitioners: entities.get('practitioners'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Availability);
