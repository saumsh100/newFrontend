
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Lorem from 'react-lorem-component';
import {
  updateEntityRequest,
  deleteEntityRequest,
  fetchEntities,
} from '../../../../../thunks/fetchEntities';
import {
  Button,
  Icon,
  Grid,
  Row,
  Col,
  Toggle,
  Input,
  DropdownSelect,
  Tabs,
  Tab,
  Header,
  SContainer,
  SHeader,
  SBody,
} from '../../../../library';
import styles from './styles.scss';

class ReminderPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    // If new reminder is selected, go to Unconfirmed Tab
    if ((nextProps.reminder.id !== this.props.reminder.id) && (this.state.index !== 0)) {
      this.setState({
        index: 0,
      });
    }
  }

  render() {
    const {
      reminder,
    } = this.props;

    const { index } = this.state;

    const isConfirmable = index === 0;

    // TODO: render preview of reminder based on type
    

    return (
      <SContainer>
        <SHeader className={styles.previewHeader}>
          <div className={styles.topHeader}>
            <Header title="Preview" />
          </div>
          <div className={styles.tabsContainer}>
            <Tabs
              index={index}
              onChange={i => this.setState({ index: i })}
              noUnderLine
            >
              <Tab
                label="Unconfirmed"
                className={styles.tab}
                activeClass={styles.activeTab}
              />
              <Tab
                label="Confirmed"
                className={styles.tab}
                activeClass={styles.activeTab}
              />
            </Tabs>
          </div>
        </SHeader>
        <SBody>
          <Tabs
            index={index}
            onChange={i => this.setState({ index: i })}
            noHeaders
          >
            <Tab label=" ">
              <div className={styles.previewBodyUnconfirmed}>
                <Lorem count={20} />
              </div>
            </Tab>
            <Tab label=" ">
              <div className={styles.previewBodyConfirmed}>
                <Lorem count={20} />
              </div>
            </Tab>
          </Tabs>
        </SBody>
      </SContainer>
    );
  }
}

ReminderPreview.propTypes = {
  reminder: PropTypes.object.isRequired,
};

/*function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateEntityRequest,
  }, dispatch);
}*/

// const enhance = connect(null, mapDispatchToProps);

export default ReminderPreview;
