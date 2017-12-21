
import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ServiceDataItem from './ServiceDataItem';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import ServicePractitioners from './ServicePractitioners';
import SettingsCard from '../Shared/SettingsCard';
import {
  Card,
  IconButton,
} from '../../library';
import styles from './styles.scss';

class ServiceDataContainer extends Component {
  constructor(props) {
    super(props);

    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(modifiedService, alert) {
    this.props.updateEntityRequest({ key: 'services', model: modifiedService, alert });
  }

  deleteService() {
    const { serviceId } = this.props;
    const deleteService = confirm('Are you sure you want to delete this service?');
    if (deleteService) {
      this.props.deleteEntityRequest({ key: 'services', id: serviceId });
      this.props.setServiceId({ id: null });
    }
  }

  render() {
    const { services, serviceId, practitioners } = this.props;

    if (!services || !practitioners) {
      return null;
    }

    const selectedService = serviceId ? services.get(serviceId) : services.first();
    let component = null;
    if (selectedService) {
      const practitionerIds = selectedService.get('practitioners');
      component = (
        <SettingsCard
          title={selectedService.get('name')}
          bodyClass={styles.serviceDataBody}
          rightActions={(
            <div>
              <IconButton
                icon="trash"
                iconType="solid"
                onClick={this.deleteService}
              />
            </div>
          )}
        >
          <ServiceDataItem
            key={`${selectedService.get('id')}basicdata`}
            service={selectedService}
            onSubmit={this.updateService}
          />
          <ServicePractitioners
            key={`${selectedService.get('id')}selectedPractitioners`}
            service={selectedService}
            practitionerIds={practitionerIds}
            updateService={this.updateService}
            practitioners={practitioners}
          />
        </SettingsCard>
      );
    }

    return (
      <Card className={styles.servicesDataContainer} noBorder>
        {component}
      </Card>
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
