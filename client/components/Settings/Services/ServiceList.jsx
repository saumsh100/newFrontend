import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ServiceItem from './ServiceItem';
import { IconButton} from '../../library';
import Modal  from '../../library/Modal';
import ServiceItemData from './ServiceItemData';
import CreateServiceForm from './CreateServiceForm';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import { setServiceId } from '../../../actions/accountSettings';
import styles from './styles.scss';

class ServiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };

    this.setActive = this.setActive.bind(this);
    this.createService = this.createService.bind(this);
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  createService(values) {
    values.customCosts = {};
    this.props.createEntityRequest({ key: 'services', entityData: values });
    this.setState({ active: false });
  }

  updateService(modifiedService) {
    this.props.updateEntityRequest({ key: 'services', model: modifiedService });
  }

  deleteService(id) {
    this.props.deleteEntityRequest({ key: 'services', id });
    this.props.setServiceId({ id: null });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  render() {
    const { services, serviceId } = this.props;

    const selectedService = serviceId ? services.get(serviceId) : services.first();
    const selectedServiceId = selectedService ? selectedService.get('id') : null;

    return(
      <div className={styles.servicesMainContainer} >
        <div className={styles.servicesListContainer}>
          <div className={styles.modalContainer}>
            <IconButton
              icon="plus"
              onClick={this.setActive}
              className={styles.addServiceButton}
            />
            <Modal
              active={this.state.active}
              onEscKeyDown={this.setActive}
              onOverlayClick={this.setActive}
            >
              <CreateServiceForm
                onSubmit={this.createService}
              />
            </Modal>
          </div>
          <div>
            {services.toArray().map((service) => {
              return (
                <ServiceItem
                  key={service.get('id')}
                  index={service.get('id')}
                  service={service.get('name')}
                  setServiceId={this.props.setServiceId}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.servicesDataContainer}>
          <ServiceItemData
            key={selectedServiceId}
            service={selectedService}
            onSubmit={this.updateService}
            deleteService={this.deleteService}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ accountSettings }) {
  return ({
    serviceId: accountSettings.get('serviceId'),
  });
}
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
    setServiceId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);
export default enhance(ServiceList);