
import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconButton, CardHeader, Grid, Row, Col  } from '../../library';
import ServiceDataItem from './ServiceDataItem';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import ServicePractitioners from './ServicePractitioners';
import styles from './styles.scss';

class ServiceDataContainer extends Component {
  constructor(props) {
    super(props);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(modifiedService) {
    this.props.updateEntityRequest({ key: 'services', model: modifiedService });
  }

  deleteService(id) {
    this.props.deleteEntityRequest({ key: 'services', id });
    this.props.setServiceId({ id: null });
  }

  render() {
    const { services, serviceId, practitioners } = this.props;

    const selectedService = serviceId ? services.get(serviceId) : services.first();
    if (!practitioners) {
      return null;
    }

    let showComponent1 = null;
    let showComponent2 = null;

    const practitionerIds = (
      selectedService ? selectedService.get('practitioners') : null);

    if (selectedService) {
      showComponent1 = (
        <ServiceDataItem
          key={`${selectedService.get('id')}basicdata`}
          service={selectedService}
          onSubmit={this.updateService}
          deleteService={this.deleteService}
        />
      );
      showComponent2 = (
        <ServicePractitioners
          key={`${selectedService.get('id')}selectedPractitioners`}
          service={selectedService}
          practitionerIds={practitionerIds}
          updateService={this.updateService}
          practitioners={practitioners}
        />
      );
    }
    return (
      <div className={styles.servicesDataContainer}>
        {showComponent1}
        {showComponent2}
      </div>
    );
  }
}

ServiceDataContainer.propTypes = {
  updateEntityRequest: PropTypes.func,
  deleteEntityRequest: PropTypes.func,
  createEntityRequest: PropTypes.func,
};


function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);
export default enhance(ServiceDataContainer);
