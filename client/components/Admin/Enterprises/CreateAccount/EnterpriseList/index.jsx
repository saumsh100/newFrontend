import React, { Component, PropTypes } from 'react';
import { List, ListItem, Button } from '../../../../library';

class EnterpriseList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      enterprises,
      setEnterprise,
      setCreate,
    } = this.props;

    return (
      <div>
        <List>
          {enterprises.map((enterprise) => {
            return (
              <ListItem
                onClick={() => {
                  setEnterprise(enterprise);
                }}
              >
                {enterprise.name}
              </ListItem>
            );
          })}
        </List>
        <Button onClick={() => setCreate()} icon="plus">
          Add Enterprise
        </Button>
      </div>
    );
  }
}

EnterpriseList.propTypes = {
  setEnterprise: PropTypes.func,
}

export default EnterpriseList;
