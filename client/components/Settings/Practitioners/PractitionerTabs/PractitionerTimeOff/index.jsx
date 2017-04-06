import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { fetchEntities } from '../../../../../thunks/fetchEntities';

class PractitionerTimeOff extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'practitioners', join: ['timeOff'] });
  }

  render() {
    const { practitionerData } = this.props;

    if (practitionerData) {
      console.log(practitionerData.timeOff);
    }

    return (
      <div>
        test
      </div>
    );
  }

}

PractitionerTimeOff.PropTypes = {
  fetchEntities: PropTypes.func,
};

function mapActionsToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

function mapStateToProps({ entities }, { practitioner }) {
  const practitionerData = entities.getIn(['practitioners', 'models', practitioner.get('id')]);

  return {
    practitionerData,
  }
}
const enhance = connect(mapStateToProps, mapActionsToProps);

export default enhance(PractitionerTimeOff);
