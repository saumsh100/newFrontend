import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../thunks/fetchEntities';
import { setServiceId } from '../../../reducers/accountSettings';
import ServiceListContainer from './ServiceListContainer';
import ServiceDataContainer from './ServiceDataContainer';
import ServiceHeader from './ServiceHeader';
import styles from './styles.scss';
import { sortPractitionersAlphabetical, sortServicesAlphabetical } from '../../Utils';

class Reasons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.setActive = this.setActive.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({
      key: 'services',
      join: ['practitioners'],
    });
    this.props.fetchEntities({ key: 'practitioners' });
    this.props.setServiceId({ id: null });
  }

  setActive() {
    const { active } = this.state;
    this.setState({ active: !active });
  }

  closeModal() {
    this.setState({ active: false });
  }

  render() {
    const { services, serviceId, practitioners } = this.props;

    if (!services || !practitioners) {
      return null;
    }

    return (
      <div className={styles.container}>
        <ServiceHeader services={services} setActive={this.setActive} />
        <div className={styles.servicesMainContainer}>
          <ServiceListContainer
            services={services}
            setServiceId={this.props.setServiceId}
            serviceId={serviceId}
            isActive={this.state.active}
            setActive={this.setActive}
            closeModal={this.closeModal}
          />
          <ServiceDataContainer
            services={services}
            setServiceId={this.props.setServiceId}
            serviceId={serviceId}
            practitioners={practitioners}
          />
        </div>
      </div>
    );
  }
}

Reasons.propTypes = {
  services: PropTypes.instanceOf(Map),
  practitioners: PropTypes.instanceOf(Map),
  serviceId: PropTypes.string,
  setServiceId: PropTypes.func.isRequired,
  fetchEntities: PropTypes.func.isRequired,
};

Reasons.defaultProps = {
  services: null,
  practitioners: null,
  serviceId: '',
};

function mapStateToProps({ entities, accountSettings }) {
  const services = entities.getIn(['services', 'models']);
  const practitioners = entities.getIn(['practitioners', 'models']);

  let serviceId = accountSettings.get('serviceId');

  const filteredPractitioners = practitioners.sort(sortPractitionersAlphabetical);
  const filteredServices = services.sort(sortServicesAlphabetical);

  if (!serviceId) {
    const selectedService = services.first();
    serviceId = selectedService && selectedService.id;
  }

  return {
    services: filteredServices,
    practitioners: filteredPractitioners,
    serviceId,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
      setServiceId,
    },
    dispatch,
  );
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Reasons);
