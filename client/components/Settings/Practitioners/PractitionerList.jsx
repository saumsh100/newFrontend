import React, {Component, PropTypes, } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PractitionerItem from './PractitionerItem';
import PractitionerItemData from './PractitionerItemData';
import CreatePractitionerForm from './CreatePractitionerForm';
import { updateEntityRequest, deleteEntityRequest, createEntityRequest } from '../../../thunks/fetchEntities';
import { setPractitionerId } from '../../../actions/accountSettings';
import styles from './styles.scss';
import { IconButton} from '../../library';
import Modal  from '../../library/Modal';

class PractitionerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };

    this.setActive = this.setActive.bind(this);
    this.createPractitioner = this.createPractitioner.bind(this);
    this.updatePractitioner = this.updatePractitioner.bind(this);
    this.deletePractitioner = this.deletePractitioner.bind(this);
  }

  createPractitioner(values) {
    this.props.createEntityRequest({ key: 'practitioners', entityData: values });
    this.setState({ active: false });
  }

  updatePractitioner(modifiedPractitioner) {
    this.props.updateEntityRequest({ key: 'practitioners', model: modifiedPractitioner });
  }

  deletePractitioner(id) {
    this.props.deleteEntityRequest({ key: 'practitioners', id });
    this.props.setPractitionerId({ id: null });
  }

  setActive() {
    const active = (this.state.active !== true);
    this.setState({ active });
  }

  render() {
    const { practitioners, practitionerId } = this.props;

    const selectedPractitioner = (
      practitionerId ? practitioners.get(practitionerId) : practitioners.first());

    const selectedPractitionerId = selectedPractitioner ? selectedPractitioner.get('id') : null;

    return(
      <div className={styles.practMainContainer} >
        <div className={styles.practListContainer}>
          <div className={styles.modalContainer}>
            <IconButton
              icon="plus"
              onClick={this.setActive}
              className={styles.addPractitionerButton}
            />
            <Modal
              active={this.state.active}
              onEscKeyDown={this.setActive}
              onOverlayClick={this.setActive}
            >
              <CreatePractitionerForm
                onSubmit={this.createPractitioner}
              />
            </Modal>
          </div>
          <div>
            {practitioners.toArray().map((practitioner) => {
              return (
                <PractitionerItem
                  key={practitioner.get('id')}
                  id={practitioner.get('id')}
                  fullname={practitioner.getFullName()}
                  setPractitionerId={this.props.setPractitionerId}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.practDataContainer}>
          <PractitionerItemData
            key={selectedPractitionerId}
            practitioner={selectedPractitioner}
            onSubmit={this.updatePractitioner}
            deletePractitioner={this.deletePractitioner}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ accountSettings }) {
  return ({
    practitionerId: accountSettings.get('practitionerId'),
  });
}
function mapActionsToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
    deleteEntityRequest,
    createEntityRequest,
    setPractitionerId,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapActionsToProps);
export default enhance(PractitionerList);