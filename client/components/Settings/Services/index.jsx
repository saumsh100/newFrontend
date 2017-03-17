import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities, } from '../../../thunks/fetchEntities';
import ServiceList from './ServiceList';
import styles from './styles.scss';

const sortServicesAlphabetical = (a, b) => {
  if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  return 0;
};

class Services extends Component {

  componentWillMount() {
    this.props.fetchEntities({key: 'services'});
  }

  render() {
    const { services } = this.props;

    let showComponent = null;
    if (services) {
      const filteredServices = services.sort(sortServicesAlphabetical);
      showComponent = (
        <ServiceList
          services={filteredServices}
        />
      );
    }

    return (
      <div className={styles.outerContainer}>
        {showComponent}
      </div>
    );
  }
}

Services.propTypes = {
  services: PropTypes.object,
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return {
    services: entities.getIn(['services', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Services);