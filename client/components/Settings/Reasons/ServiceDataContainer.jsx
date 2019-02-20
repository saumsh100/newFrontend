
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import ServiceDataItem from './ServiceDataItem';
import { updateEntityRequest, deleteEntityRequest } from '../../../thunks/fetchEntities';
import ServicePractitioners from './ServicePractitioners';
import SettingsCard from '../Shared/SettingsCard';
import { Card, IconButton } from '../../library';
import EnabledFeature from '../../library/EnabledFeature';
import ReasonHours from './ReasonHours';
import styles from './styles.scss';

class ServiceDataContainer extends Component {
  constructor(props) {
    super(props);

    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(modifiedService, alert) {
    this.props.updateEntityRequest({
      key: 'services',
      model: modifiedService,
      alert,
    });
  }

  deleteService() {
    const { serviceId } = this.props;
    const deleteService = window.confirm('Are you sure you want to delete this reason?');
    if (deleteService) {
      this.props.deleteEntityRequest({
        key: 'services',
        id: serviceId,
      });
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
          rightActions={
            <div
              data-test-id="removeService"
              onClick={this.deleteService}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.keyCode === '13' && this.deleteService(e)}
            >
              <IconButton icon="trash" iconType="solid" />
            </div>
          }
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
          <EnabledFeature
            predicate={({ flags }) => flags.get('reason-schedule-component')}
            render={() => <ReasonHours />}
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
  updateEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  serviceId: PropTypes.string.isRequired,
  setServiceId: PropTypes.func.isRequired,
};

const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      updateEntityRequest,
      deleteEntityRequest,
    },
    dispatch,
  );

export default connect(
  null,
  mapActionsToProps,
)(ServiceDataContainer);
