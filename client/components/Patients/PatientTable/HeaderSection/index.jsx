import React, { Component, PropTypes } from 'react';
import { Button, DialogBox, Input } from '../../../library';
import NewPatientForm from '../NewPatientForm';
import RemoteSubmitButton from '../../../library/Form/RemoteSubmitButton';
import SmartFilters from '../SmartFilters';
import styles from '../styles.scss';
import FilterTags from '../SmartFilters/FilterTags';


class HeaderSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      filterActive: false,
      filter: [],
    };
    this.setActive = this.setActive.bind(this);
    this.openFilter = this.openFilter.bind(this);
    this.reinitializeState = this.reinitializeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFilterSubmit = this.handleFilterSubmit.bind(this);
    this.removeFilter = this.removeFilter.bind(this);
    this.addFilterToTable = this.addFilterToTable.bind(this);
  }

  setActive() {
    this.setState({
      active: true,
    });
  }

  openFilter() {
    this.setState({
      filterActive: !this.state.filterActive,
    });
  }
  reinitializeState() {
    this.setState({
      active: false,
      filterActive: false,
    });
  }

  handleSubmit(values) {
    const {
      createEntityRequest,
    } = this.props;

    values.isSyncedWithPms = false;

    const alert = {
      success: {
        body: 'New Patient Added.',
      },
      error: {
        body: 'Failed to add patient.',
      },
    };

    createEntityRequest({
      key: 'patients',
      entityData: values,
      alert,
    }).then(() => {
      this.reinitializeState();
    });
  }

  handleFilterSubmit(values) {
    const valueKeys = Object.keys(values);
    const filterArray = [];
    valueKeys.map((key) => {
      const innerObj = values[key]
      const innerKeys = Object.keys(innerObj);

      filterArray.push({
        id: key,
        value: innerKeys[0],
      });
    });

    this.setState({
      filter: filterArray,
    });

    this.reinitializeState();
  }

  addFilterToTable(filter) {
    const {
      addSmartFilter,
    } = this.props;

    addSmartFilter(filter);
    console.log(filter);
  }

  removeFilter() {
    this.setState({
      filter: [],
    });
    this.reinitializeState();
    this.props.reinitializeTable();
  }

  render() {
    const {
      smartFilters,
      totalPatients,
      onFilterSearch,
    } = this.props;

    const formName = 'newUser';

    const actions = [
      { label: 'Cancel', onClick: this.reinitializeState, component: Button, props: { color: 'darkgrey' } },
      { label: 'Save', onClick: this.handleSubmit, component: RemoteSubmitButton, props: { form: formName }},
    ];

    return (
      <div className={styles.header}>
        <div>
          <div className={styles.header_title}> All Patients </div>
          <div className={styles.header_subHeader}>
            Showing {totalPatients} Patients
          </div>
        </div>
        <div className={styles.searchBar}>
          <Input
            label="Search"
            onChange={e => onFilterSearch(e.target.value)}
            icon="search"
            value={this.props.searchValue}
          />
        </div>
        <FilterTags
          smartFilters={this.state.filter}
          removeSmartFilter={this.removeFilter}
        />
        <div className={styles.addNewButton}>
          <div className={styles.filterContainer}>
            <SmartFilters
              filterActive={this.state.filterActive}
              smartFilters={smartFilters}
              handleSubmit={this.handleFilterSubmit}
              addFilterToTable={this.addFilterToTable}
            />
          </div>

          <Button
            onClick={() => this.setActive()}
            border="blue"
          >
            Add New Patient
          </Button>
        </div>

        <DialogBox
          actions={actions}
          title="Add New Patient"
          type="medium"
          active={this.state.active}
          onEscKeyDown={this.reinitializeState}
          onOverlayClick={this.reinitializeState}
        >
          <NewPatientForm
            onSubmit={this.handleSubmit}
            formName={formName}
          />
        </DialogBox>
      </div>
    );
  }
}

export default HeaderSection;
