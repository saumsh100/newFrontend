import React, { PropTypes, Component } from 'react';
import styles from './styles.scss';
import ChatListContainer from './ChatListContainer';
import MessageContainer from './MessageContainer';
import { Row, Col, CardHeader, Card, Input, List, Grid, InfiniteScroll, Avatar } from '../../library';

class ChatMessage extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    const info = (this.props.currentPatient ? `To: ${this.props.currentPatient.firstName} ${this.props.currentPatient.lastName} ${this.props.currentPatient.phoneNumber}` : null);

    return (
      <Grid>
        <Row className={styles.patients}>
          <Col xs={12} sm={4} md={4} lg={3}>
            <div className={styles.patients_list}>
              <Row className={styles.topRow}>
                <Card className={styles.headerInput}>
                  <div className={styles.header}>
                    <CardHeader title="Chat Search" />
                  </div>
                  <div className={styles.input}>
                    <Input />
                  </div>
                </Card>
              </Row>
              <Row className={styles.listRow}>
                <Card className={styles.upcomingHead}>
                  <div className={styles.header}>
                    <CardHeader title="Messages" />
                  </div>
                  <List className={styles.patients_list__users}>
                    <InfiniteScroll
                      loadMore={this.props.loadMore}
                      loader={<div style={{ clear: 'both' }}>Loading...</div>}
                      hasMore={this.props.moreData}
                      initialLoad={false}
                      useWindow={false}
                      threshold={1}
                    >
                      <ChatListContainer
                        textMessages={this.props.textMessages}
                        chats={this.props.chats}
                        patients={this.props.patients}
                        onClick={this.props.setCurrentPatient}
                        currentPatient={this.props.currentPatient}
                      />
                    </InfiniteScroll>
                  </List>
                </Card>
              </Row>
            </div>
          </Col>
          <Col xs={12} sm={8} md={8} lg={9} className={styles.messages}>
            <div className={styles.topInfo}>
              {info}
            </div>
            <div className={styles.main}>
              <MessageContainer
                selectedChat={this.props.selectedChat}
                currentPatient={this.props.currentPatient}
                textMessages={this.props.textMessages}
              />
              <div className={styles.rightInfo}>
                <div className={styles.patInfo}>

                </div>
                <div className={styles.bottomInfo}>

                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

ChatMessage.propTypes = {
  textMessages: PropTypes.object.isRequired,
  createEntityRequest: PropTypes.func.isRequired,
};

export default ChatMessage;
