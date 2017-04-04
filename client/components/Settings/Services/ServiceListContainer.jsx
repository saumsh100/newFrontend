import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IconButton, CardHeader, Col } from '../../library';
import Modal from '../../library/Modal';
import CreateServiceForm from './CreateServiceForm';
import ServiceListItem from './ServiceListItem';
import { createEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class ServiceListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.createService = this.createService.bind(this);
    this.setActive = this.setActive.bind(this);
  }
  
  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  createService(values) {
    values.name = values.name.trim();
    values.customCosts = {};
    const key = 'services';
    this.props.createEntityRequest({ key , entityData: values })
      .then((entities) => {
        const id = Object.keys(entities[key])[0];
        this.props.setServiceId({ id });
      });
    this.setState({ active: false });
  }

  render() {
    const { services } = this.props;

    if (!services) {
      return null;
    }

    return (
      <Col xs={2} className={styles.servicesListContainer}>
        <div className={styles.modalContainer}>
          <CardHeader count={services.size} title="Services" />
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
        {services.toArray().map((service) => {
          return (
            <ServiceListItem
              key={service.get('id')}
              id={service.get('id')}
              service={service.get('name')}
              setServiceId={this.props.setServiceId}
            />
          );
        })}
      </Col>
    );
  }
}
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ServiceListContainer);
