import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../thunks/fetchEntities';
import { setServiceId } from '../../../actions/accountSettings';
import ServiceListContainer from './ServiceListContainer';
import ServiceDataContainer from './ServiceDataContainer';
import { Col } from '../../library';
import styles from './styles.scss';

const sortPractitionersAlphabetical = (a, b) => {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

const sortServicesAlphabetical = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

class Services extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'services', join: ['practitioners'] });
    this.props.fetchEntities({ key: 'practitioners' });
    this.props.setServiceId({ id: null });
  }

  render() {
    const { services, serviceId, practitioners } = this.props;

    if (!services || !practitioners) {
      return null;
    }

    return (
      <div className={styles.servicesMainContainer} >
        <ServiceListContainer
          services={services}
          setServiceId={this.props.setServiceId}
          serviceId={serviceId}
        />
        <ServiceDataContainer
          services={services}
          setServiceId={this.props.setServiceId}
          serviceId={serviceId}
          practitioners={practitioners}
        />
      </div>
    );
  }
}

Services.propTypes = {
  services: PropTypes.object,
  practitioners: PropTypes.object,
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities, accountSettings }) {
  const services = entities.getIn(['services', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);

  let serviceId = accountSettings.get('serviceId');

  const filteredPractitioners = practitioners.sort(sortPractitionersAlphabetical);
  const filteredServices = services.sort(sortServicesAlphabetical);

  if (!serviceId) {
    serviceId = null;
  }

  return {
    services: filteredServices,
    practitioners: filteredPractitioners,
    serviceId,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
    setServiceId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Services);
