import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { StandardButton as Button, Card, SContainer, SBody } from '../../library';
import CreateServiceForm from './CreateServiceForm';
import ServiceListItem from './ServiceListItem';
import { createEntityRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';
import DialogBox from '../../library/DialogBox/index';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';

class ServiceListContainer extends Component {
  constructor(props) {
    super(props);
    this.createService = this.createService.bind(this);
  }

  createService(values) {
    const { submitForm, resetFormValues, setServiceId } = this.props;
    const newReason = {
      ...values,
      name: values.name.trim(),
      customCosts: {},
    };
    const key = 'services';
    const alert = {
      success: {
        body: `${newReason.name} service created.`,
      },
      error: {
        body: `${newReason.name} service could not be created.`,
      },
    };

    this.props.closeModal();
    submitForm({
      key,
      alert,
      entityData: newReason,
    }).then((entities) => {
      const [id] = Object.keys(entities[key]);
      setServiceId({ id });
    });
    resetFormValues();
  }

  render() {
    const { services, serviceId } = this.props;

    if (!services) {
      return null;
    }

    const formName = 'createServiceForm';
    const actions = [
      {
        label: 'Cancel',
        onClick: this.setActive,
        component: Button,
        props: { variant: 'secondary' },
      },
      {
        label: 'Save',
        onClick: this.createService,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: formName,
        },
      },
    ];

    return (
      <Card className={styles.servicesListContainer} noBorder>
        <SContainer>
          <SBody>
            {services.toArray().map((service) => (
              <ServiceListItem
                key={service.get('id')}
                id={service.get('id')}
                service={service.get('name')}
                setServiceId={this.props.setServiceId}
                serviceId={serviceId}
                duration={service.get('duration')}
              />
            ))}
          </SBody>
        </SContainer>
        <div className={styles.modalContainer}>
          <DialogBox
            active={this.props.isActive}
            actions={actions}
            onEscKeyDown={this.props.setActive}
            onOverlayClick={this.props.setActive}
            title="Create New Reason"
          >
            <CreateServiceForm formName={formName} onSubmit={this.createService} />
          </DialogBox>
        </div>
      </Card>
    );
  }
}

ServiceListContainer.propTypes = {
  submitForm: PropTypes.func.isRequired,
  resetFormValues: PropTypes.func.isRequired,
  setServiceId: PropTypes.func.isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  serviceId: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      submitForm: createEntityRequest,
      resetFormValues: () => dispatch(reset('createServiceForm')),
    },
    dispatch,
  );
}

const enhance = connect(null, mapActionsToProps);

export default enhance(ServiceListContainer);
