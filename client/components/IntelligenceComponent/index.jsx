import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, Col, Grid, Row } from '../library';
import ChartStats from '../library/ChartGrid'
import { FlexGrid, Stats } from '../library/FlexGrid';

class IntelligenceComponent extends Component {
  render() {
    return (
      <div>
	      <Grid>
		      <Row>
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

	        	<FlexGrid title="Appoinment Types" > 
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      					border
      				/>
      				<ChartStats
      					positive={80}
      					negative={20}
      					percantage={80}
      				/>
	        	</FlexGrid>

	        	<FlexGrid title="Appoinment Types" > 
      				<Stats
      					count={106}
      					details="via phone"
      					icon="telegram"
      					border
      				/>
      				<ChartStats
      					positive={50}
      					negative={50}
      					percantage={50}
      				/>
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
		      </Row>
	      </Grid>
      </div>
    );
  }
}

export default IntelligenceComponent; 
