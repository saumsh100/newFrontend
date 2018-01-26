
import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  BadgeHeader,
  Card,
  SContainer,
  SHeader,
  SBody,
  SFooter,
} from '../../library';
import Modal from '../../library/Modal';
import CreateServiceForm from './CreateServiceForm';
import ServiceListItem from './ServiceListItem';
import { createEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';
import DialogBox from '../../library/DialogBox/index';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';

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
    this.setState({ active: !this.state.active });
  }

  createService(values) {
    values.name = values.name.trim();
    values.customCosts = {};
    const key = 'services';
    const alert = {
      success: {
        body: `${values.name} service created.`,
      },
      error: {
        body: `${values.name} service could not be created.`,
      },
    };

    this.props.createEntityRequest({ key , entityData: values, alert })
      .then((entities) => {
        const id = Object.keys(entities[key])[0];
        this.props.setServiceId({ id });
      });
    this.setState({ active: false });
  }

  render() {
    const { services, serviceId } = this.props;

    if (!services) {
      return null;
    }

    const formName = 'createServiceForm';
    const actions = [
      { label: 'Cancel', onClick: this.setActive, component: Button, props: { border: 'blue' } },
      { label: 'Save', onClick: this.createService, component: RemoteSubmitButton, props: { color: 'blue', form: formName } },
    ];

    return (
      <Card className={styles.servicesListContainer} noBorder>
        <SContainer>
          <SHeader>
            <div className={styles.modalContainer}>
              <div className={styles.displayFlexCenter}>
                <Button
                  icon="plus"
                  onClick={this.setActive}
                  className={styles.addServiceButton}
                  data-test-id="addPractitionerButton"
                  secondary
                >
                  Add New Service
                </Button>
              </div>
              <BadgeHeader
                count={services.size}
                title="Services"
                className={styles.badgeHeader}
              />
              <DialogBox
                active={this.state.active}
                actions={actions}
                onEscKeyDown={this.setActive}
                onOverlayClick={this.setActive}
                title="Create New Service"
              >
                <CreateServiceForm
                  formName={formName}
                  onSubmit={this.createService}
                />
              </DialogBox>
            </div>
          </SHeader>
          <SBody>
            {services.toArray().map((service) => {
              return (
                <ServiceListItem
                  key={service.get('id')}
                  id={service.get('id')}
                  service={service.get('name')}
                  setServiceId={this.props.setServiceId}
                  serviceId={serviceId}
                />
              );
            })}
          </SBody>
        </SContainer>
      </Card>
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
