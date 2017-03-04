
import React, {PropTypes, Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GeneralForm from './GeneralForm';
import Address from '../Address';
import { Map } from 'immutable';
import { updateEntityRequest } from '../../../../thunks/fetchEntities';
import { Grid, Row, Col, CardHeader} from '../../../library';



class General extends React.Component {

  constructor(props) {
    super(props);
    this.updateName = this.updateName.bind(this);
  }

  updateName(values) {
    const { activeAccount, updateEntityRequest } = this.props;
    const valuesMap = Map(values);
    const modifiedAccount =activeAccount.merge(valuesMap);
    updateEntityRequest({ key: 'accounts', model: modifiedAccount });
  }

  render() {
    const { activeAccount } = this.props;

    let showComponent = null;
    if (activeAccount) {
      showComponent = (
        <Grid>
          <CardHeader title="Basic" />
          <Row>
            <GeneralForm
              onSubmit={this.updateName}
              activeAccount={activeAccount}
            />
          </Row>
          <CardHeader title="Address" />
          <Row>
            <Address activeAccount={activeAccount} />
          </Row>
        </Grid>
      );
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

General.propTypes = {
  updateEntityRequest: PropTypes.func,
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(General);