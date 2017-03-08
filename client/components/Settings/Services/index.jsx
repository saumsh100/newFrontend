import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities, } from '../../../thunks/fetchEntities';
import { Grid } from '../../library';
import ServiceList from './ServiceList';

class Services extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'services' });
  }

  render() {
    const { services } = this.props;
    let showComponent = null;
    if (services) {
      showComponent = (
        <ServiceList
          services={services}
        />
      );
    }

    return (
      <Grid>
        {showComponent}
      </Grid>
    );
  }
}

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