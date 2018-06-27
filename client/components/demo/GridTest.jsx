
import React from 'react';
import withHoverable from '../../hocs/withHoverable';
import {
  Grid,
  Row,
  Col,
  Card,
  DropdownMenu,
  Link,
  MenuItem,
  MenuSeparator,
} from '../library';

function GridTest({ isHovered }) {
  return (
    <div>
      {isHovered ? 'ALIVE' : 'DEAD'}
      <Grid>
        <Row>
          <Col xs>
            <Card>Patients List</Card>
          </Col>
          <Col xs>
            <Row>
              <Col xs>Picture</Col>
            </Row>
            <Row>
              <Col xs>Event Log</Col>
              <Col xs>Settings</Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

export default withHoverable(GridTest);
