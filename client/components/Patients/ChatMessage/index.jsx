import React, { PropTypes, Component } from 'react';
import styles from './styles.scss';
import ChatListContainer from './ChatListContainer';
import { Row, Col, CardHeader, Card, Input, List, Grid, InfiniteScroll } from '../../library';

class ChatMessage extends Component {

  constructor(props) {
    super(props);
  }
  render() {

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
                      />
                    </InfiniteScroll>
                  </List>
                </Card>
              </Row>
            </div>
          </Col>
          <Col xs={12} sm={8} md={8} lg={9}>
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
