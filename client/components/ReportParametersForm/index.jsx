
import React, { Component } from 'react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { accountShape } from '../library/PropTypeShapes';
import DropdownSelect from '../library/ui-kit/DropdownSelect';
import PrimaryButton from '../library/ui-kit/Button/PrimaryButton';
import SelectPill from '../library/ui-kit/SelectPill';
import Toggle from '../library/ui-kit/Toggle';
import NavDropdownList from '../library/NavDropdownList';
import FormGenerator from './formGenerator';
import { categories } from '../Reports/Pulse/utils';
import DayRangeWithHelpers from '../library/ui-kit/DayPicker/DayRangeWithHelpers';
import forms from './forms.json';
import FormParamsMapper from './helpers';
import { setActiveReport, setReportParameters } from '../../reducers/intelligenceReports';
import ModeReport from '../ModeReport';
import styles from './style.scss';

const DATE_RANGE = 'dateRange';
const TOGGLE = 'toggle';
const SELECT_PILL = 'selectPill';
const DROPDOWN = 'dropdown';
const BUTTON = 'button';

const getStringDate = date => date.split('T')[0];

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

const DatePills = [{ value: 'day' }, { value: 'week' }, { value: 'month' }, { value: 'quarter' }];

class ReportParametersForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canReRun: false,
    };

    this.changePage = this.changePage.bind(this);
    this.setParam = this.setParam.bind(this);
    this.reRunReports = this.reRunReports.bind(this);
  }

  componentDidMount() {
    const { page, dateRange } = queryString.parse(window.location.search);
    if (page) {
      this.decodeUrlAndSetParams();
      if (dateRange) {
        this.reRunReports();
      }
    } else {
      this.props.setActiveReport('onlineBooking');
      this.setDefaultParamValues('onlineBooking');
    }
  }

  /**
   * Sets query url based on params used in form.
   */
  setQueryUrl(active, obj = null) {
    const { reports } = this.props;
    const params = obj || reports.get(active);

    this.props.setReportParameters({
      key: active,
      value: params,
    });
    this.allFormConditionsValidated(params);

    const paramsListed = queryString.stringify(
      {
        page: active,
        ...params,
        [DATE_RANGE]: JSON.stringify(params[DATE_RANGE]),
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
   * @param rerun
   */
  setParam(param, value, rerun = false) {
    const { active, reports } = this.props;
    if (reports.get(active)[param] !== value) {
      this.setQueryUrl(active, {
        ...reports.get(active),
        [param]: value,
      });
      this.allFormConditionsValidated(
        {
          ...reports.get(active),
          [param]: value,
        },
        rerun,
      );
    }
  }

  setDateValue(param, { fromDate, toDate }) {
    const { reports, active } = this.props;
    const { dateRange } = reports.get(active);
    const [sanitizedFromDate, sanitizedToDate] = [getStringDate(fromDate), getStringDate(toDate)];
    if (
      !dateRange ||
      dateRange.fromDate !== sanitizedFromDate ||
      dateRange.toDate !== sanitizedToDate
    ) {
      this.setParam(param, {
        fromDate: sanitizedFromDate,
        toDate: sanitizedToDate,
      });
    }
  }

  /**
   * After page is selected for the first time, take default values out of forms.json
   * for each field, and set it in state.
   */
  setDefaultParamValues(page) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const defaultParams = forms[page].fields
      .filter(field => field.component !== BUTTON)
      .map(({ name, defaultValue }) => {
        const placeholder = defaultValue || null;
        const paramValue =
          name === 'dateRange'
            ? {
              fromDate: getStringDate(firstDay.toISOString()),
              toDate: getStringDate(lastDay.toISOString()),
            }
            : placeholder;
        return { [name]: paramValue };
      });

    this.setQueryUrl(page, Object.assign(...defaultParams));
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
    this.props.setActiveReport(page);
    this.props.setReportParameters({
      key: page,
      value: Object.assign(...finalListOfParams),
    });

    this.allFormConditionsValidated(Object.assign(...finalListOfParams));
  }

  /**
   * Validate that all required form fields are provided.
   * Set state after that.
   */
  allFormConditionsValidated(data, rerun = false) {
    const { active } = this.props;

    const formRequiredFields = forms[active].fields
      .filter(field => field.required)
      .map(field => field.name);

    const isFieldSet = (key, value) => (!value || value === '') && formRequiredFields.includes(key);

    const errorField = Object.entries(data).find(([key, value]) => isFieldSet(key, value));
    this.setState({ canReRun: !rerun && !errorField });
  }

  /**
   * Change the page & set the default parameters for that page.
   * @param page
   */
  changePage(page) {
    this.props.setActiveReport(page);

    this.props.reports.get(page) ? this.setQueryUrl(page) : this.setDefaultParamValues(page);
  }

  reRunReports() {
    this.setState({
      canReRun: false,
    });
  }

  render() {
    const { active, account, reports } = this.props;
    const params = reports.get(active);

    return (
      <div className={styles.wrapper}>
        <div className={styles.navDropdownListWrapper}>
          <NavDropdownList
            onChange={this.changePage}
            options={this.getListOfPages()}
            selected={active}
          />
        </div>
        {params && (
          <FormGenerator
            parameters={parameters}
            page={active}
            componentProps={{
              dateRange: {
                label: 'Date Range',
                popover: true,
                fromDate: params.dateRange.fromDate,
                toDate: params.dateRange,
                timezone: this.props.timezone,
                onChange: value => this.setDateValue('dateRange', value),
              },
              categories: {
                options: categories,
                selected: params.categories,
                label: 'Category',
                onChange: value => this.setParam('categories', value),
              },
              showComparisons: {
                label: 'Display Comparisons',
                checked: params.showComparisons,
                onChange: value => this.setParam('showComparisons', value.target.checked),
              },
              dateRangeFilter: {
                options: DatePills,
                selected: params.dateRangeFilter,
                onChange: value => this.setParam('dateRangeFilter', value, true),
              },
              submit: {
                label: 'Re-run Reports',
                disabled: !this.state.canReRun,
                onClick: this.reRunReports,
              },
            }}
          />
        )}
        <ModeReport
          reportId={forms[active].reportId}
          reportActionTitle={forms[active].userFriendlyName}
          reportActionAccountName={account.get('name')}
          parameters={{
            Account_name: account.get('id'),
            ...FormParamsMapper(active, params),
          }}
        />
      </div>
    );
  }
}

ReportParametersForm.propTypes = {
  timezone: PropTypes.string.isRequired,
  account: PropTypes.shape(accountShape).isRequired,
  setActiveReport: PropTypes.func.isRequired,
  setReportParameters: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
  reports: PropTypes.instanceOf(Map).isRequired,
};

const mapStateToProps = ({ entities, auth, intelligenceReports }) => ({
  active: intelligenceReports.get('active'),
  reports: intelligenceReports.getIn(['reports']),
  account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setActiveReport,
      setReportParameters,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportParametersForm);
