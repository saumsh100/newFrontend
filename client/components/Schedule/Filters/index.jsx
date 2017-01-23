import React, { Component, PropTypes } from 'react';
import { Card } from '../../library';
import Checkbox from 'react-toolbox/lib/checkbox';

class Filters extends Component {
  constructor(props) {
  	super(props);
  	this.handleTypeFilter = this.handleTypeFilter.bind(this);
  }

  handleCheckDoctor(practitionerId, checked) {	
  	if (checked) {
  		this.props.removePractitionerFromFilter(practitionerId);
  	} else {
  		this.props.addPractitionerToFilter(practitionerId);
  	}
  }

  handleTypeFilter(type) {
  	this.props.selectAppointmentType(type.target.value);
  }

  render() {
  	const { practitioners, schedule, appointmentsTypes } = this.props;
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
			    <div>
			    	Services:
			    	<select onChange={this.handleTypeFilter} >
				    	<option value="all">All</option>
				    	{appointmentsTypes.map(app => (
				    		<option value={app}>{app}</option>
				    	))}
			    	</select>
			    </div>
		    </div>
	  	</Card>
  	);
  }
}

export default Filters;
