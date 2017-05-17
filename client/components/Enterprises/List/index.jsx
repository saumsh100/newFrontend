import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchEntities, deleteEntityRequest } from '../../../thunks/fetchEntities';
import { Card, CardHeader, List as LList } from '../../library';
import EnterpriseListItem from './ListItem';
import styles from './styles.scss';

class List extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'enterprises' });
  }

  render() {
    const { enterprises } = this.props;
    const deleteRequest = id => this.props.deleteEntityRequest({ key: 'enterprises', id });

    return (
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader} title="Enterprises" />
          <LList className={styles.list}>
            {enterprises.map(({ name, id }) => (
              <EnterpriseListItem
                name={name}
                id={id}
                onDelete={deleteRequest}
              />
            ))}
          </LList>
        </Card>
      </div>
    );
  }
}

List.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  isHovered: PropTypes.bool,
};

const stateToProps = state => ({
  enterprises: state.entities.get('enterprises').get('models'),
});

const dispatchToProps = dispatch =>
  bindActionCreators({
    fetchEntities,
    deleteEntityRequest,
  }, dispatch);

export default connect(stateToProps, dispatchToProps)(List);

