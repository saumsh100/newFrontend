import React, { PropTypes, Component } from 'react';
import { Card, CardHeader, Col, Grid, Row } from '../library';
import ChartStats from '../library/ChartGrid'
import { FlexGrid, Stats } from '../library/FlexGrid';
import { AtomTextBlock, AtomText, AtomTextBlockWrapper } from '../library/AtomText';
import styles from './styles.scss';

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
      				/>
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      				/>
	        	</FlexGrid>

	        	<FlexGrid title="Appoinment Types" > 
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      				/>
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      				/>
      				<Stats
      					count={306}
      					details="phone"
      					icon="phone"
      				/>
	        	</FlexGrid>

	        	<FlexGrid title="Appoinment Types" > 
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
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
      				/>
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      				/>
	        	</FlexGrid>

	        	<FlexGrid title="Appoinment Types" > 
      				<Stats
      					count={106}
      					details="via phone"
      					icon="telegram"
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
      				/>
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      				/>
      				<Stats
      					count={106}
      					details="via phone"
      					icon="telegram"
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
      				/>
      				<Stats
      					count={106}
      					details="via phone"
      					icon="phone"
      				/>
	        	</FlexGrid>
		      </Row>


          <Row>
            <Col xs={12} md={6}>
              <Card>
                <CardHeader title={'Vebsite Visitor Conversions'} />

                  <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                    
                    <AtomTextBlockWrapper styles={{flexDirection: 'row', margin: '60px 0px 60px 0px'}}>
                      <AtomTextBlock styles={{ justifyContent: 'center', width: 220 }} >
                        <AtomText styles={{color: "#2EC4A7", fontSize: 82, fontWeight: 800  }}>3.5%</AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 800, textAlign: 'center' }} >Conversions Rate</AtomText>
                      </AtomTextBlock>
                    </AtomTextBlockWrapper>


                    <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
                      <AtomTextBlock styles={{ justifyContent: 'center' }} >
                        <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800 }}>11086</AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }} >Visits</AtomText>
                      </AtomTextBlock>

                      <AtomTextBlock styles={{ justifyContent: 'center' }} >
                        <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800 }}>388</AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }}>Appoinments</AtomText>
                      </AtomTextBlock>
                    </AtomTextBlockWrapper>

                  </AtomTextBlockWrapper>


              </Card>
            </Col>
            
            <Col xs={12} md={6}>
              <Card>
                <CardHeader count={3} title={'Vebsite Visitor Conversions'} />
                  <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <AtomTextBlock styles={{ justifyContent: 'center' }} >
                      <AtomText styles={{color: "#27EDF5", fontSize: 48 }}>11086</AtomText>
                      <AtomText styles={{color: "#3AB116", fontSize: 24 }} >Visits</AtomText>
                    </AtomTextBlock>

                    <AtomTextBlock styles={{ justifyContent: 'center' }} >
                      <AtomText styles={{color: "#27EDF5", fontSize: 48 }}>388</AtomText>
                      <AtomText styles={{color: "#3AB116", fontSize: 24 }} >Appoinments</AtomText>
                    </AtomTextBlock>

                    <AtomTextBlock styles={{ justifyContent: 'center' }} >
                      <AtomText styles={{color: "#27EDF5", fontSize: 48 }}>388</AtomText>
                      <AtomText styles={{color: "#3AB116", fontSize: 24 }} >Appoinments</AtomText>
                    </AtomTextBlock>
                  </AtomTextBlockWrapper>


                  <AtomTextBlockWrapper styles={{flexDirection: 'row'}}>
                    <AtomTextBlock styles={{ justifyContent: 'center' }}  >
                      <AtomText styles={{color: "#27EDF5", fontSize: 48 }} icon="calendar"></AtomText>
                      <AtomText styles={{color: "#3AB116", fontSize: 24 }} >11221</AtomText>
                    </AtomTextBlock>

                    <AtomTextBlock styles={{ justifyContent: 'center' }}  >
                      <AtomText styles={{color: "#27EDF5", fontSize: 48 }} icon="calendar"></AtomText>
                      <AtomText styles={{color: "#3AB116", fontSize: 24 }} >11221</AtomText>
                    </AtomTextBlock>
                  </AtomTextBlockWrapper>

              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card>
                <CardHeader title="Male vs Famale" />  
                <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                  <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <AtomTextBlock styles={{ justifyContent: 'center' }} >
                      <AtomText styles={{color: "#27EDF5", fontSize: 82, fontWeight: 800 }} icon="user-o"></AtomText>
                      <AtomText styles={{color: "#27EDF5", fontSize: 82, fontWeight: 800, margin: "30px 0px 0px 0px" }}>55%</AtomText>
                      <AtomText styles={{color: "#000000", fontSize: 24 }} >Famale</AtomText>
                    </AtomTextBlock>

                    <AtomTextBlock styles={{ justifyContent: 'center' }} >
                      <AtomText styles={{color: "#8FBBD6", fontSize: 82, fontWeight: 800 }} icon="user-o"></AtomText>
                      <AtomText styles={{color: "#8FBBD6", fontSize: 82, fontWeight: 800, margin: "30px 0px 0px 0px" }}>55%</AtomText>
                      <AtomText styles={{color: "#000000", fontSize: 24 }} >Male</AtomText>
                    </AtomTextBlock>
                  </AtomTextBlockWrapper>
                </AtomTextBlockWrapper>
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card>
                <CardHeader title="Age Range" />  
                <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>
                  <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around'}}>

                  </AtomTextBlockWrapper>
                </AtomTextBlockWrapper>
              </Card>
            </Col>

            <Col xs={12} md={6}>
              <Card>
                <CardHeader title="Visitors by device" />
                  <AtomTextBlockWrapper styles={{ flexDirection: 'column', display: 'flex', height: '400', justifyContent: 'center' }}>  
                    <AtomTextBlockWrapper styles={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end'}}>
                      <AtomTextBlock styles={{ justifyContent: 'center' }} >
                        <AtomText styles={{color: "#FF705A", fontSize: 56, fontWeight: 800 }} icon="mobile-phone"></AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800, margin: "30px 0px 0px 0px" }} >5844</AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }} >Mobile</AtomText>
                      </AtomTextBlock>
                      <AtomTextBlock styles={{ justifyContent: 'center' }} >
                        <AtomText styles={{color: "#8FBBD6", fontSize: 64, fontWeight: 800 }} icon="tablet"></AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800, margin: "30px 0px 0px 0px" }}>579</AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }}>Tablet</AtomText>
                      </AtomTextBlock>
                      <AtomTextBlock styles={{ justifyContent: 'center' }} >
                        <AtomText styles={{color: "#2EC4A7", fontSize: 82, fontWeight: 800 }} icon="television"></AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 48, fontWeight: 800, margin: "30px 0px 0px 0px" }}>4663</AtomText>
                        <AtomText styles={{color: "#000000", fontSize: 24, fontWeight: 200 }}>Website</AtomText>
                      </AtomTextBlock>
                    </AtomTextBlockWrapper>
                  </AtomTextBlockWrapper>
              </Card>
            </Col>

          </Row>  
	      </Grid>
      </div>
    );
  }
}

export default IntelligenceComponent; 
