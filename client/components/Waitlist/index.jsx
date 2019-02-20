
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import WaitlistSchedule from '../Schedule/Header/Waitlist';
import { MassDelete as MassDeleteWaitSpots } from '../GraphQLWaitlist';
import { setBackHandler, setTitle } from '../../reducers/electron';
import SelectedCounter from './SelectedCounter';
import ExtraOptionsHubMenu from '../ExtraOptionsHubMenu';
import AddToWaitlistPage from './AddToWaitlistPage';
import { WAITLIST_PAGE, WATILIST_ADD } from '../../constants/PageTitle';

class Waitlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedElements: [],
      showAddForm: false,
    };

    this.selectWaitSpot = this.selectWaitSpot.bind(this);
    this.deleteSelectedElements = this.deleteSelectedElements.bind(this);
    this.clearSelectedList = this.clearSelectedList.bind(this);
    this.showAddForm = this.showAddForm.bind(this);
    this.hideAddForm = this.hideAddForm.bind(this);
  }

  getMenuOptions(massDeleteHandler) {
    if (this.state.selectedElements.length > 0) {
      return [
        {
          icon: 'trash',
          text: 'DELETE',
          onClick: this.deleteSelectedElements(massDeleteHandler),
        },
        {
          icon: 'ban',
          text: 'CANCEL',
          onClick: this.clearSelectedList,
        },
      ];
    }

    return [
      {
        icon: 'plus',
        text: 'ADD',
        onClick: this.showAddForm,
      },
      {
        icon: 'rocket',
        text: 'RUN WAITLIST',
        onClick: () => console.log(),
      },
    ];
  }

  deleteSelectedElements(massDeleteHandler) {
    return () => {
      massDeleteHandler(this.state.selectedElements);
      this.clearSelectedList();
    };
  }

  clearSelectedList() {
    this.setState({ selectedElements: [] });
  }

  selectWaitSpot(id) {
    const elementsList = this.state.selectedElements;
    const indexInSelected = elementsList.indexOf(id);

    if (indexInSelected > -1) {
      elementsList.splice(indexInSelected, 1);
    } else {
      elementsList.push(id);
    }

    this.setState({ selectedElements: elementsList });
  }

  showAddForm() {
    this.setState({ showAddForm: true }, () => {
      this.props.setBackHandler(() => {
        this.hideAddForm();
      });
      this.props.setTitle(WATILIST_ADD);
    });
  }

  hideAddForm() {
    this.setState({ showAddForm: false }, () => {
      this.props.setBackHandler(null);
      this.props.setTitle(WAITLIST_PAGE);
    });
  }

  render() {
    const { showAddForm } = this.state;

    return (
      <MassDeleteWaitSpots>
        {massDeleteHandler => (
          <div>
            {showAddForm && <AddToWaitlistPage onSubmit={this.hideAddForm} />}
            <ExtraOptionsHubMenu options={this.getMenuOptions(massDeleteHandler)}>
              <WaitlistSchedule
                selectWaitSpot={this.selectWaitSpot}
                selectedWaitSpots={this.state.selectedElements}
              />
            </ExtraOptionsHubMenu>
            <SelectedCounter selected={this.state.selectedElements} />
          </div>
        )}
      </MassDeleteWaitSpots>
    );
  }
}

Waitlist.propTypes = {
  setBackHandler: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setBackHandler,
      setTitle,
    },
    dispatch,
  );

export default connect(
  null,
  mapDispatchToProps,
)(Waitlist);
