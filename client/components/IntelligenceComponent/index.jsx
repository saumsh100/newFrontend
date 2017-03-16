import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, Col, Grid, Row } from '../library';
import ChartGrid from '../library/ChartGrid'
import { FlexGrid, Stats } from '../library/FlexGrid';

class IntelligenceComponent extends Component {
  render() {
    return (
      <div>
	      <Grid>
		      <Row>
      			<Col xs={12} md={6} >
		        	<FlexGrid title="Appoinment Types" > 
        				<Stats
        					count={106}
        					details="via phone"
        					icon="phone"
        					border
        				/>
        				<Stats
        					count={106}
        					details="via phone"
        					icon="phone"
        					border
        				/>
		        	</FlexGrid>

		        	<FlexGrid title="Appoinment Types" > 
        				<Stats
        					count={106}
        					details="via phone"
        					icon="phone"
        					border
        				/>
        				<Stats
        					count={106}
        					details="via phone"
        					icon="phone"
        					border
        				/>
        				<Stats
        					count={306}
        					details="phone"
        					icon="phone"
        					border
        				/>
		        	</FlexGrid>
		        </Col>
		      </Row>
	      </Grid>
      </div>
    );
  }
}

export default IntelligenceComponent; 
