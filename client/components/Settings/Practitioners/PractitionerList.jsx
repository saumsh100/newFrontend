
import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { createEntityRequest, updateEntityRequest } from '../../../thunks/fetchEntities';
import { setPractitionerId } from '../../../actions/accountSettings';
import {
  IconButton,
  BadgeHeader,
  Col,
  Card,
  Button,
  SContainer,
  SHeader,
  SBody,
} from '../../library';
import PractitionerTabs from './PractitionerTabs';
import PractitionerItem from './PractitionerItem';
import CreatePractitionerForm from './CreatePractitionerForm';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import DialogBox from '../../library/DialogBox';
import styles from './styles.scss';

class PractitionerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };

    this.setActive = this.setActive.bind(this);
    this.createPractitioner = this.createPractitioner.bind(this);
  }

  componentWillMount() {
    this.props.setPractitionerId({ id: null });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  createPractitioner(values) {
    const { services } = this.props;

    values.firstName = values.firstName.trim();
    values.lastName = values.lastName ? values.lastName.trim() : undefined;

    const key = 'practitioners';

    let serviceIds = [];
    if (services) {
      serviceIds = services.toArray().map((service) => service.get('id'));
    }

    const alert = {
      success: {
        body: `${values.firstName} was added as a practitioner.`
      },
      error: {
        body: `${values.firstName} could not be added as a practitioner.`
      },
    };

    //creates the practitioner and then updates with all services set to true
    this.props.createEntityRequest({ key, entityData: values })
      .then((entities) => {
        const id = Object.keys(entities[key])[0];
        let savedPrac = entities[key][id];

        savedPrac.id = id;
        savedPrac.services = serviceIds;
        const modifiedPrac = Map(savedPrac);

        this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPrac, url: `/api/practitioners/${id}`, alert: alert });
        this.props.setPractitionerId({ id });
      });

    this.setState({ active: false });
  }

  render() {
    const {
      practitioners,
      services,
      selectedPractitioner,
    } = this.props;

    if (!selectedPractitioner) {
      return null;
    }

    const formName = 'addPractitionerForm';
    const actions = [
      { label: 'Cancel', onClick: this.setActive, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.createPractitioner, component: RemoteSubmitButton, props: { form: formName } },
    ];

    return (
      <div className={styles.practMainContainer}>
        <Card className={styles.listCardStyles}>
          <SContainer>
            <SHeader className={styles.listHeader}>
              <div className={styles.displayFlexCenter}>
                <Button
                  icon="plus"
                  onClick={this.setActive}
                  className={styles.addPractitionerButton}
                  data-test-id="addPractitionerButton"
                  secondary
                >
                  Add New Practitioner
                </Button>
              </div>
              <BadgeHeader
                count={practitioners.size}
                title="Practitioners"
                className={styles.badgeHeader}
              />
              <DialogBox
                active={this.state.active}
                onEscKeyDown={this.setActive}
                onOverlayClick={this.setActive}
                title="Add New Practitioner"
                actions={actions}
              >
                <CreatePractitionerForm
                  formName={formName}
                  onSubmit={this.createPractitioner}
                />
              </DialogBox>
            </SHeader>
            <SBody>
              {practitioners.toArray().map((practitioner) => {
                return (
                  <PractitionerItem
                    key={practitioner.get('id')}
                    id={practitioner.get('id')}
                    practitionerId={selectedPractitioner.get('id')}
                    practitioner={practitioner}
                    fullName={practitioner.getFullName()}
                    setPractitionerId={this.props.setPractitionerId}
                    data-test-id={`${practitioner.get('firstName')}${practitioner.get('lastName')}`}
                  />
                );
              })}
            </SBody>
          </SContainer>
        </Card>
        <div className={styles.practDataContainer}>
          <PractitionerTabs
            key={selectedPractitioner.get('id')}
            practitioner={selectedPractitioner}
            setPractitionerId={this.props.setPractitionerId}
            services={services}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ accountSettings }, { practitioners }) {
  const practitionerId = accountSettings.get('practitionerId');
  const selectedPractitioner = (practitionerId ?
    practitioners.get(practitionerId) : practitioners.first());

  return {
    selectedPractitioner,
  };
}
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    createEntityRequest,
    updateEntityRequest,
    setPractitionerId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);
export default enhance(PractitionerList);
