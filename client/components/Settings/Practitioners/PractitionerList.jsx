
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { createEntityRequest, updateEntityRequest } from '../../../thunks/fetchEntities';
import { setPractitionerId } from '../../../reducers/accountSettings';
import { BadgeHeader, Card, Button, SContainer, SHeader, SBody } from '../../library';
import PractitionerTabs from './PractitionerTabs';
import PractitionerItem from './PractitionerItem';
import CreatePractitionerForm from './CreatePractitionerForm';
import RemoteSubmitButton from '../../library/Form/RemoteSubmitButton';
import DialogBox from '../../library/DialogBox';
import { practitionerShape } from '../../library/PropTypeShapes';
import Service from '../../../entities/models/Service';
import styles from './styles.scss';

class PractitionerList extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };

    this.setActive = this.setActive.bind(this);
    this.createPractitioner = this.createPractitioner.bind(this);
  }

  componentDidMount() {
    this.props.setPractitionerId({ id: null });
  }

  setActive() {
    const active = this.state.active !== true;
    this.setState({ active });
  }

  createPractitioner(values) {
    const { services } = this.props;

    values.firstName = values.firstName.trim();
    values.lastName = values.lastName ? values.lastName.trim() : undefined;

    const key = 'practitioners';

    let serviceIds = [];
    if (services) {
      serviceIds = services.toArray().map(service => service.get('id'));
    }

    const alert = {
      success: { body: `${values.firstName} was added as a practitioner.` },
      error: { body: `${values.firstName} could not be added as a practitioner.` },
    };

    // creates the practitioner and then updates with all services set to true
    this.props
      .createEntityRequest({
        key,
        entityData: values,
      })
      .then((entities) => {
        const id = Object.keys(entities[key])[0];
        const savedPrac = entities[key][id];

        const modifiedPrac = Map({
          ...savedPrac,
          id,
          services: serviceIds,
        });

        this.props.updateEntityRequest({
          key: 'practitioners',
          model: modifiedPrac,
          url: `/api/practitioners/${id}`,
          alert,
        });
        this.props.setPractitionerId({ id });
      });

    this.setState({ active: false });
  }

  render() {
    const { practitioners, services, selectedPractitioner } = this.props;
    const activePractitioner = selectedPractitioner || practitioners[0];

    const formName = 'addPractitionerForm';
    const actions = [
      {
        label: 'Cancel',
        onClick: this.setActive,
        component: Button,
        props: { border: 'blue' },
      },
      {
        label: 'Save',
        onClick: this.createPractitioner,
        component: RemoteSubmitButton,
        props: {
          color: 'blue',
          form: formName,
        },
      },
    ];

    return (
      <div className={styles.practMainContainer}>
        <Card className={styles.listCardStyles} noBorder>
          <SContainer>
            <SHeader className={styles.listHeader}>
              <div className={styles.displayFlexCenter}>
                <Button
                  onClick={this.setActive}
                  className={styles.addPractitionerButton}
                  data-test-id="button_addPractitioner"
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
                <CreatePractitionerForm formName={formName} onSubmit={this.createPractitioner} />
              </DialogBox>
            </SHeader>
            <SBody>
              {practitioners.toArray().map(practitioner => (
                <PractitionerItem
                  key={practitioner.get('id')}
                  id={practitioner.get('id')}
                  practitionerId={activePractitioner.get('id')}
                  practitioner={practitioner}
                  fullName={practitioner.getFullName()}
                  setPractitionerId={this.props.setPractitionerId}
                  data-test-id={`${practitioner.get('firstName')}${practitioner.get('lastName')}`}
                />
              ))}
            </SBody>
          </SContainer>
        </Card>
        {activePractitioner && (
          <Card className={styles.practDataContainer} noBorder>
            <PractitionerTabs
              key={activePractitioner.get('id')}
              practitioner={activePractitioner}
              setPractitionerId={this.props.setPractitionerId}
              services={services}
            />
          </Card>
        )}
      </div>
    );
  }
}

PractitionerList.propTypes = {
  createEntityRequest: PropTypes.func.isRequired,
  practitioners: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  selectedPractitioner: PropTypes.instanceOf(practitionerShape).isRequired,
  setPractitionerId: PropTypes.func.isRequired,
  services: PropTypes.instanceOf(Service).isRequired,
  updateEntityRequest: PropTypes.func.isRequired,
};

function mapStateToProps({ accountSettings }, { practitioners }) {
  const practitionerId = accountSettings.get('practitionerId');
  const selectedPractitioner = practitionerId
    ? practitioners.get(practitionerId)
    : practitioners.first();

  return { selectedPractitioner };
}
function mapActionsToProps(dispatch) {
  return bindActionCreators(
    {
      createEntityRequest,
      updateEntityRequest,
      setPractitionerId,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapActionsToProps,
);
export default enhance(PractitionerList);
