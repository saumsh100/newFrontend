
import React from 'react';
import { Grid, Row, Col, Card, DropdownMenu, Link, MenuItem, MenuSeparator } from '../library';

export default function GridTest() {
  return (
    <div>
      <Grid>
        <Row>
          <Col xs>
            <Card>
              Patients List
            </Card>
          </Col>
          <Col xs>
            <Row>
              <Col xs>
                Picture
              </Col>
            </Row>
            <Row>
              <Col xs>
                Event Log
              </Col>
              <Col xs>
                Settings
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}
