import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities, } from '../../../thunks/fetchEntities';
import { Grid } from '../../library';
import ServiceList from './ServiceList';

const sortServicesAlphabetical = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

class Services extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'services' });
  }

  render() {
    const { services } = this.props;

    let showComponent = null;
    if (services) {
      const filteredServices = services.sort(sortServicesAlphabetical);
      showComponent = (
        <ServiceList
          services={filteredServices}
        />
      );
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  return {
    services: entities.getIn(['services', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Services);