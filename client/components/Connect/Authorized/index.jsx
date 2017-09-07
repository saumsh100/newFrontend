
import React, { Component, PropTypes } from 'react';
import Header from '../Header';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchEntitiesRequest } from '../../../thunks/fetchEntities';
import styles from './styles.scss';

class Authorized extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchEntitiesRequest({ key: 'accounts' });
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div>
        <Header />
        {children}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchEntitiesRequest,
  }, dispatch);
}

const enhance = connect(null, mapDispatchToProps);

export default enhance(Authorized);
