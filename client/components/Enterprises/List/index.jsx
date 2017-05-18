import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchEntities, deleteEntityRequest } from '../../../thunks/fetchEntities';
import { Card, CardHeader, List as LList, Button } from '../../library';
import EnterpriseListItem from './ListItem';
import styles from './styles.scss';

class List extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'enterprises' });
  }

  render() {
    const { enterprises } = this.props;
    const deleteRequest = id => this.props.deleteEntityRequest({ key: 'enterprises', id });

    const baseUrl = (path = '') => `/enterprises${path}`;
    const navigateToCreatePage = () => this.props.navigate(baseUrl('/create'));
    const navigateToEditPage = uuid => this.props.navigate(baseUrl(`/${uuid}/edit`));

    return (
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader} title="Enterprises">
            <div>
              <Button
                icon="plus-circle"
                default
                onClick={navigateToCreatePage}
              >Add</Button>
            </div>
          </CardHeader>
          <div className={styles.cardContent}>
            <LList>
              {enterprises.map(({ name, id }) => (
                <EnterpriseListItem
                  key={id}
                  name={name}
                  id={id}
                  onDelete={deleteRequest}
                  onEdit={navigateToEditPage}
                />
              ))}
            </LList>
          </div>
        </Card>
      </div>
    );
  }
}

List.propTypes = {
  fetchEntities: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  enterprises: PropTypes.arrayOf(
    PropTypes.object
  ),
};

const stateToProps = state => ({
  enterprises: Object.values(state.entities
    .getIn(['enterprises', 'models'])
    .toJS()),
});

const dispatchToProps = dispatch =>
  bindActionCreators({
    fetchEntities,
    deleteEntityRequest,
    navigate: push,
  }, dispatch);

export default connect(stateToProps, dispatchToProps)(List);

