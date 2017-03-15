import React, { PropTypes, Component } from 'react';
import { SideBySideCard, ChartGrid } from '../library/SideBySideCard'
import { Col, Grid, Row } from '../library/Grid';

class IntelligenceComponent extends Component {
  render() {
    return (
      <div>
	      <Grid>
			      <Row>
	      			<Col xs={12} md={6} >
			        	<SideBySideCard 
			        		items={[
			        			{count: 106, details: 'via phone', icon: 'phone', first: true},
			        			{count: 206, details: 'via ...', icon: 'phone'},
			        			{count: 306, details: 'viadsaa ...', icon: 'phone'},
			        		]} 
			        		title={"Appoinment Types"}
			        	/>
	      			</Col>
	      			<Col xs={12} md={6} >
			        	<SideBySideCard 
			        		items={[
			        			{count: 206, details: 'via facebook', icon: 'phone', first: true},
			        			{count: 406, details: '...phone', icon: 'phone'}
			        		]}
			        		title={"Appoinment Types"}
			        	/>
			      	</Col>

	      			<Col xs={12} md={6} >
			        	<ChartGrid
			        		title="Online reputation"
			        		stars={"4/5"}
			        		text={"start"}
			        		positive={12}
			        		negative={3}
			        		icon="star"
			        	/>
			      	</Col>




			      </Row>
	    
	      </Grid>
      </div>
    );
  }
}

export default IntelligenceComponent; 