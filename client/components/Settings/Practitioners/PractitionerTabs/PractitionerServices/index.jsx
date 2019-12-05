
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../../../thunks/fetchEntities';
import PractServicesForm from './PractServicesForm';
import Practitioner from '../../../../../entities/collections/practitioners';

const sortServicesAlphabetical = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

function createInitialValues(serviceIds, services) {
  return services.map(s => serviceIds.indexOf(s.get('id')) > -1).toJS();
}

class PractitionerServices extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchEntities({ key: 'services' });
  }

  handleSubmit(values) {
    const { practitioner, updatePractitioner } = this.props;
    const storeServiceIds = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const id in values) {
      if (values[id]) {
        storeServiceIds.push(id);
      }
    }

    const modifiedPractitioner = practitioner.set('services', storeServiceIds);

    const alert = {
      success: {
        body: `${practitioner.get('firstName')} updated services.`,
      },
      error: {
        body: `${practitioner.get('firstName')} services update failed.`,
      },
    };

    updatePractitioner(modifiedPractitioner, alert);
  }

  render() {
    const { serviceIds, services, practitioner } = this.props;

    if (!practitioner || !services) {
      return null;
    }

    let showComponent = null;

    if (services) {
      const filteredServices = services.sort(sortServicesAlphabetical);
      const initialValues = createInitialValues(serviceIds, services);

      if (Object.keys(initialValues).length) {
        showComponent = (
          <PractServicesForm
            key={practitioner.get('id')}
            services={filteredServices}
            initialValues={initialValues}
            practitioner={practitioner}
            handleSubmit={this.handleSubmit}
            formName={`${practitioner.get('id')}service`}
          />
        );
      }
    }

    return <div style={{ width: '25%' }}>{showComponent}</div>;
  }
}

function mapStateToProps({ entities }) {
  return {
    services: entities.getIn(['services', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchEntities,
    },
    dispatch,
  );
}

const enhance = connect(
  mapStateToProps,
  mapDispatchToProps,
);

PractitionerServices.propTypes = {
  serviceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  practitioner: PropTypes.instanceOf(Practitioner).isRequired,
  fetchEntities: PropTypes.func.isRequired,
  updatePractitioner: PropTypes.func.isRequired,
};

export default enhance(PractitionerServices);
