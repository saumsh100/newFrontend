
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ListItem, Grid, Row, Col, Toggle, IconButton } from '../../library';
import LastSyncDisplay from '../../LastSyncDisplay';
import Advanced from './Advanced';
import styles from './item.scss';

const toggleIcons = {
  checked: <div>ON</div>,

  unchecked: <div>OFF</div>,
};

export default class ConnectorsListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      isCollapsed: true,
    };

    this.toggleConnector = this.toggleConnector.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleConnector(e) {
    const { account } = this.props;
    if (
      window.confirm(`Are you sure you want to turn on the connector for ${account.name}?`)
    ) {
      this.setState({ active: !this.state.active });
    }
  }

  toggleCollapsed(e) {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const { account } = this.props;

    return (
      <div className={styles.itemWrapper}>
        <ListItem onClick={this.toggleCollapsed} className={styles.listItem}>
          <Grid className={styles.grid}>
            <Row className={styles.row}>
              <Col xs={4} className={styles.col}>
                <div>
                  <div className={styles.name}>{account.name}</div>
                  <div className={styles.id}>{account.id}</div>
                </div>
              </Col>
              <Col xs={4} className={styles.col}>
                <LastSyncDisplay
                  className={styles.lastSync}
                  date={account.lastSyncDate}
                />
              </Col>
              <Col xs={4} className={styles.lastCol}>
                {/* This is here so that the collapsed click does not also get called */}
                {/* <div onClick={e => e.stopPropagation()}>
                  <Toggle
                    value={this.state.active}
                    onChange={this.toggleConnector}
                    // icons={toggleIcons}
                  />
                </div> */}
                <div>
                  <IconButton
                    icon={this.state.isCollapsed ? 'caret-up' : 'caret-down'}
                    onClick={this.toggleCollapsed}
                    type="solid"
                  />
                </div>
              </Col>
            </Row>
          </Grid>
        </ListItem>
        {!this.state.isCollapsed ? (
          <Advanced key={`Advanced_${account.id}`} account={account} />
        ) : null}
      </div>
    );
  }
}

ConnectorsListItem.propTypes = {
  accounts: PropTypes.object,
};
