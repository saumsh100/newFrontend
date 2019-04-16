
import React, { Component } from 'react';
import queryString from 'query-string';
import DropdownSelect from '../library/ui-kit/DropdownSelect';
import PrimaryButton from '../library/ui-kit/Button/PrimaryButton';
import SelectPill from '../library/ui-kit/SelectPill';
import Toggle from '../library/ui-kit/Toggle';
import NavDropdownList from '../library/NavDropdownList';
import FormGenerator from './formGenerator';
import { categories } from '../Reports/Pulse/utils';
import DayRangeWithHelpers from '../library/ui-kit/DayPicker/DayRangeWithHelpers';
import forms from './forms.json';
import styles from './style.scss';

const DATE_RANGE = 'dateRange';
const TOGGLE = 'toggle';
const SELECT_PILL = 'selectPill';
const DROPDOWN = 'dropdown';
const BUTTON = 'button';

/**
 * Map components used within forms.json with the actual Components.
 */
const parameters = {
  ...forms,
  defaultComponents: {
    [DATE_RANGE]: DayRangeWithHelpers,
    [TOGGLE]: Toggle,
    [SELECT_PILL]: SelectPill,
    [DROPDOWN]: DropdownSelect,
    [BUTTON]: PrimaryButton,
  },
};
/*
will need this for future
const pages = [
  {
    value: 'onlineBooking',
    label: 'Online Booking',
  },
  {
    value: 'donnasReminders',
    label: 'Donna\'s Reminders',
  },
  {
    value: 'donnasRecalls',
    label: 'Donna\'s Recalls',
  },
  {
    value: 'donnasReviews',
    label: 'Donna\'s Reviews',
  },
  {
    value: 'totalProduction',
    label: 'Total Production',
  },
]; */

const DatePills = [{ value: 'day' }, { value: 'week' }, { value: 'month' }, { value: 'quarter' }];

export default class ReportParametersForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'onlineBooking',
      canReRun: false,
      params: {},
    };

    this.changePage = this.changePage.bind(this);
    this.setParam = this.setParam.bind(this);
  }

  componentDidMount() {
    this.setDefaultParamValues();
    this.decodeUrlAndSetParams();
  }

  /**
   * Sets query url based on params used in form.
   */
  setQueryUrl() {
    const { page, params } = this.state;
    const paramsListed = queryString.stringify(
      {
        page,
        ...params[page],
        [DATE_RANGE]: JSON.stringify(params[page][DATE_RANGE]),
      },
      { arrayFormat: 'bracket' },
    );
    window.history.pushState(null, null, `?${paramsListed}`);
  }

  /**
   * Set a given param to the provided value.
   * After thats done, update query url and check form validity.
   * @param param
   * @param value
   */
  setParam(param, value) {
    const { page } = this.state;

    this.setState(
      {
        params: {
          ...this.state.params,
          [page]: {
            ...this.state.params[page],
            [param]: value,
          },
        },
      },
      () => {
        this.setQueryUrl();
        this.allFormConditionsValidated();
      },
    );
  }

  /**
   * After page is selected for the first time, take default values out of forms.json
   * for each field, and set it in state.
   */
  setDefaultParamValues() {
    const { page } = this.state;
    if (this.state.params[page]) return;

    const defaultParams = forms[page].fields
      .filter(field => field.component !== BUTTON)
      .map(({ name, defaultValue }) => ({ [name]: defaultValue || null }));

    this.setState(
      {
        ...this.state,
        params: {
          ...this.state.params,
          [page]: Object.assign(...defaultParams),
        },
      },
      () => this.setQueryUrl(),
    );
  }

  /**
   * return the list of fields for a given page.
   * @param page
   * @return {*}
   */
  getPageValidFields(page) {
    return forms[page].fields.filter(field => field.component !== BUTTON).map(field => field.name);
  }

  getListOfPages() {
    return Object.entries(forms).map(([pageKey, value]) => ({
      value: pageKey,
      label: value.userFriendlyName,
    }));
  }

  /**
   * Decode url query params and set the state.
   * Used when URL with query params is set when initially opening page.
   */
  decodeUrlAndSetParams() {
    const query = window.location.search;
    if (!query || query === '') return;

    const { page, ...params } = queryString.parse(query);

    if (!page) return;

    const validPageFields = this.getPageValidFields(page);

    const parseFieldIfDate = field =>
      (field === DATE_RANGE ? JSON.parse(decodeURI(params[field])) : params[field]);

    const finalListOfParams = validPageFields.map(field => ({ [field]: parseFieldIfDate(field) }));
    this.setState(
      {
        page,
        params: {
          ...this.state.params,
          [page]: Object.assign(...finalListOfParams),
        },
      },
      this.allFormConditionsValidated,
    );
  }

  /**
   * Validate that all required form fields are provided.
   * Set state after that.
   */
  allFormConditionsValidated() {
    const { page, params } = this.state;

    const formRequiredFields = forms[page].fields
      .filter(field => field.required)
      .map(field => field.name);

    const isFieldSet = (key, value) => (!value || value === '') && formRequiredFields.includes(key);

    const errorField = Object.entries(params[page]).find(([key, value]) => isFieldSet(key, value));

    this.setState({ canReRun: !errorField });
  }

  /**
   * Change the page & set the default parameters for that page.
   * @param page
   */
  changePage(page) {
    this.setState({ page }, () => {
      this.state.params[page] ? this.setQueryUrl() : this.setDefaultParamValues();
    });
  }

  render() {
    const { params, page } = this.state;

    return (
      <div>
        <div className={styles.navDropdownListWrapper}>
          <NavDropdownList
            onChange={this.changePage}
            options={this.getListOfPages()}
            selected={this.state.page}
          />
        </div>
        {params[page] && (
          <FormGenerator
            parameters={parameters}
            page={this.state.page}
            componentProps={{
              dateRange: {
                label: 'Date Range',
                popover: true,
                from: params[page].dateRange ? params[page].dateRange.from : null,
                to: params[page].dateRange ? params[page].dateRange.to : null,
                onChange: value => this.setParam('dateRange', value),
              },
              categories: {
                options: categories,
                selected: params[page].categories,
                label: 'Category',
                onChange: value => this.setParam('categories', value),
              },
              showComparisons: {
                label: 'Display Comparisons',
                checked: params[page].showComparisons,
                onChange: value => this.setParam('showComparisons', value.target.checked),
              },
              dateRangeFilter: {
                options: DatePills,
                selected: params[page].dateRangeFilter,
                onChange: value => this.setParam('dateRangeFilter', value),
              },
              submit: {
                label: 'Re-run Reports',
                disabled: !this.state.canReRun,
                onClick: () => this.setState({ canReRun: false }),
              },
            }}
          />
        )}
      </div>
    );
  }
}
