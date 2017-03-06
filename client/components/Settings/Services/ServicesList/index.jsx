import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { Grid, CardHeader, Row } from '../../../library';
import ServiceItem from './ServiceItem';


class ServicesList extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.props.fetchEntities({ key: 'services'});
  }


  render() {

    const { services } = this.props;

    return (
      <Grid>
        {services.toArray().map((service) => {
          return(
            <ServiceItem
              key={service.get('id')}
              service={service}
            />
          );
        })}
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

const enhance = connect(mapStateToProps, mapDispatchToProps)

export default enhance(ServicesList);