import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities, } from '../../../thunks/fetchEntities';
import ServiceList from './ServiceList';
import { Col } from '../../library';
import styles from './styles.scss';

const sortServicesAlphabetical = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

const sortPractitionersAlphabetical = (a, b) => {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};


class Services extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'services', join: ['practitioners'] });
    this.props.fetchEntities({ key: 'practitioners' });
  }

  render() {

    const { services, practitioners } = this.props;

    let showComponent = null;
    if (services && practitioners) {
      const filteredServices = services.sort(sortServicesAlphabetical);
      const filteredPractitioners = practitioners.sort(sortPractitionersAlphabetical);
      showComponent = (
        <ServiceList
          services={filteredServices}
          practitioners={filteredPractitioners}
        />
      );
    }

    return (
      <Col xs={12}>
        {showComponent}
      </Col>
    );
  }
}

Services.propTypes = {
  services: PropTypes.object,
  practitioners: PropTypes.object,
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return {
    services: entities.getIn(['services', 'models']),
    practitioners: entities.getIn(['practitioners', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Services);
