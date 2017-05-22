import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router-dom';
import { fetchEntities, deleteEntityRequest } from '../../../../thunks/fetchEntities';
import {
  Card,
  CardHeader,
  List as LList,
  VButton as Button,
  Breadcrumbs,
  Row,
  Col,
} from '../../../library/index';
import EnterpriseListItem from './ListItem';
import styles from './styles.scss';

class List extends Component {

  componentWillMount() {
    this.props.fetchEntities({ key: 'enterprises' });
  }

  render() {
    const { enterprises } = this.props;
    const deleteRequest = id => this.props.deleteEntityRequest({ key: 'enterprises', id });

    const baseUrl = (path = '') => `/admin/enterprises${path}`;
    const navigateToEditPage = uuid => this.props.navigate(baseUrl(`/${uuid}/edit`));

    const breadcrumbs = [
      { icon: 'home', key: 'home', home: true, link: '/admin' },
      { title: 'Enterprises', key: 'enterprises', link: '/admin/enterprises' },
    ];

    return (
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader} title="Enterprises" />
          <div className={styles.cardContent}>
            <Row middle="md" className={styles.headerPanel}>
              <Col md={8}>
                <Breadcrumbs items={breadcrumbs} />
              </Col>
              <Col md={4} style={{ textAlign: 'right' }}>
                <Button
                  as={Link}
                  icon="plus"
                  positive
                  rounded
                  compact
                  to={baseUrl('/create')}
                >Add more</Button>
              </Col>
            </Row>


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

