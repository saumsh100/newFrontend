import React, { Component, PropTypes } from 'react';
import { Card } from '../../library';
import Checkbox from 'react-toolbox/lib/checkbox';

class Filters extends Component {
  constructor(props) {
  	super(props);
  }

  handleCheckDoctor(practitionerId, checked) {	
  	if (checked) {
  		this.props.removePractitionerFromFilter(practitionerId);
  	} else {
  		this.props.addPractitionerToFilter(practitionerId);
  	}
  }

  render() {
  	const { practitioners, schedule } = this.props;
  	const filterPractitioners = schedule.toJS().practitioners;
  	return (
	    <Card style={{minHeight: '480px'}}>
		    <div>
		      Filters:
		    </div>
		    <div>
		    	Practitioners:
			    {practitioners.map(pr => {
			    	const checked = filterPractitioners.indexOf(pr.id) > -1;
			    	return (
				    	<Checkbox
				        checked={checked}
				        label={pr.firstName}
				        onChange={this.handleCheckDoctor.bind(this, pr.id, checked)}
				      />
			    	)
			    })}
		    </div>
	  	</Card>
  	);
  }
}

export default Filters;
