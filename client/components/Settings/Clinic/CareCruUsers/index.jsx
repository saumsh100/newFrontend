import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../../../../thunks/fetchEntities';
import { Grid, CardHeader, Row } from '../../../library';
import CareCruUser from './CareCruUser';


class CareCruUsers extends Component{

  constructor(props){
    super(props)
  }

  componentWillMount(){
    this.props.fetchEntities({ key: 'users'});
  }

  render() {
    const { careCruUsers } = this.props;
    return (
      <Grid>
        <Row>
          <CardHeader title="CareCru Users" />
        </Row>
        {careCruUsers.toArray().map((user) => {
          return (
            <CareCruUser
              key={user.id}
              careCruUser={user}
            />
          );
        })}
      </Grid>
    );
  }
}

CareCruUsers.propTypes = {
  fetchEntities: PropTypes.func,
  careCruUsers: PropTypes.object,
};

function mapStateToProps({ entities }) {
  return {
    careCruUsers: entities.getIn(['users', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(CareCruUsers);
