import React, {Component, PropTypes,} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntities, } from '../../../thunks/fetchEntities';
import PractitionerList from './PractitionerList';

const sortPractitionersAlphabetical = (a, b) => {
  if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
  if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
  return 0;
};

class Practitioners extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'practitioners' });
  }

  render() {
    const { practitioners } = this.props;

    let showComponent = null;
    if (practitioners) {
      const filteredPractitioners = practitioners.sort(sortPractitionersAlphabetical);
      showComponent = (
        <PractitionerList
          practitioners={filteredPractitioners}
        />
      );
    }

    return (
      <div>
        {showComponent}
      </div>
    );
  }
}

function mapStateToProps({ entities }) {
  return {
    practitioners: entities.getIn(['practitioners', 'models']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntities,
  }, dispatch);
}

const enhance = connect(mapStateToProps, mapDispatchToProps);

export default enhance(Practitioners);