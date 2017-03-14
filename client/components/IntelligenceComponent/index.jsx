import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, Col, Grid, Row, SideBySideCard } from '../library';


// TODO: split up the Cards into their own components, ApptTypesCard, NewReturningCard, etc.
// TODO: load in data from Container
class IntelligenceComponent extends Component {
  render() {
    return (
			<div>
				<Grid>
					<Col xs={12}>
						<Row>
							<Col xs={6}>
								<Card>
									<CardHeader title="Appointment Types" />
									<SideBySideCard
										title="Appoinment Types"
										items={[
                      {count: 106, details: 'via phone', icon: 'phone', first: true},
                      {count: 206, details: 'via ...', icon: 'phone'},
                    ]}
									/>
								</Card>
							</Col>
							<Col xs={6}>
								<Card>
									<CardHeader title="Appointment Types" />
									<SideBySideCard
										title="Appoinment Types"
										items={[
											{count: 206, details: 'via facebook', icon: 'phone', first: true},
											{count: 406, details: '...phone', icon: 'phone'}
									  ]}
									/>
								</Card>
							</Col>
						</Row>
					</Col>
				</Grid>
			</div>
    );
  }
}

export default IntelligenceComponent; 