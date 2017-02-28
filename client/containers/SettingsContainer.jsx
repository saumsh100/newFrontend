import React, { PropTypes, Component } from 'react';
import Settings from '../components/Settings';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities } from '../thunks/fetchEntities';

// TODO: fetch current Settings and user (should already be in Redux)
class SettingsContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchEntities({ key: 'accounts' });
  }

  render() {
    return (
      <div>
        <Settings {...this.props} />
      </div>
    );
  }
}

SettingsContainer.propTypes = {
  fetchEntities: PropTypes.func,
};

function mapStateToProps({ entities }) {
  return {
    activeAccount: entities.getIn(['accounts', 'models']).first(),
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(SettingsContainer);
