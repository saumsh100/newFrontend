import React, { PropTypes, Component } from 'react';
import SideBySideCard from '../library/SideBySideCard'
import { Col, Grid, Row } from '../library/Grid';

class IntelligenceComponent extends Component {
  render() {
    return (
      <div>
	      <Grid>
	      		<Col xs={12}>
			      	<Row>	
			        	<SideBySideCard items={[{count: 106, details: 'via phone', icon: 'phone'}, {count: 206, details: 'via ...', icon: 'phone'} ]} title={"some title"} />
			        	<SideBySideCard items={[{count: 206, details: 'via facebook', icon: 'phone'}, {count: 406, details: '...phone', icon: 'phone'}]} title={"another title"} />
			      	</Row>
	      		</Col>
	    
	      </Grid>
      </div>
    );
  }
}

export default IntelligenceComponent; 