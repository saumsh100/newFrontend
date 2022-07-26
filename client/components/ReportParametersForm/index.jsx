import React, { Component } from 'react';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format } from 'date-fns';
import { accountShape } from '../library/PropTypeShapes';
import DropdownSelect from '../library/ui-kit/DropdownSelect';
import SelectPill from '../library/ui-kit/SelectPill';
import Toggle from '../library/ui-kit/Toggle';
import NavDropdownList from '../library/NavDropdownList';
import FormGenerator from './formGenerator';
import DayRangeWithHelpers from '../library/ui-kit/DayPicker/DayRangeWithHelpers';
import { setActiveReport, setReportParameters } from '../../reducers/intelligenceReports';
import ModeReport from '../ModeReport';
import { isFeatureEnabledSelector } from '../../reducers/featureFlags';
import MultiSelectAccount from '../library/MultiSelectAccount';
import styles from './style.scss';
import getRangeFromList from '../../util/getRangeFromList';

const DATE_RANGE = 'dateRange';
const TOGGLE = 'toggle';
const SELECT_PILL = 'selectPill';
const DROPDOWN = 'dropdown';
const MULTI_SELECT_ACCOUNT = 'multiSelectAccount';

const defaultComponents = {
  [DATE_RANGE]: DayRangeWithHelpers,
  [TOGGLE]: Toggle,
  [MULTI_SELECT_ACCOUNT]: MultiSelectAccount,
  [SELECT_PILL]: SelectPill,
  [DROPDOWN]: DropdownSelect,
};

const reportAccessPermissions = {
  collectionsDashboard: {
    denyRoles: ['MANAGER'],
  },
  productionDashboard: {
    denyRoles: ['MANAGER'],
  },
  'annual-report-procedures': {
    denyRoles: ['MANAGER'],
  },
};

const parseDate = (rawDate) => {
  return format(new Date(rawDate), 'yyyy-MM-dd');
};

const handleDefaultValue = (name, { defaultValue, component, accountId, ...compt }) => {
  if (component === MULTI_SELECT_ACCOUNT && defaultValue === undefined) {
    return [accountId];
  }

  const dateKey = Object.keys(compt.name).find((key) => compt.name[key] === name);
  if (component === DATE_RANGE && typeof defaultValue === 'string') {
    const [defaultRange] = getRangeFromList([defaultValue]);
    return parseDate(defaultRange[dateKey]);
  }

  const nullIfUndefined = defaultValue === undefined ? null : defaultValue;
  return typeof defaultValue === 'object' && !Array.isArray(defaultValue)
    ? defaultValue[dateKey]
    : nullIfUndefined;
};

class ReportParametersForm extends Component {
  constructor(props) {
    super(props);

    this.changePage = this.changePage.bind(this);
    this.setParam = this.setParam.bind(this);
  }

  /**
   * If the URL contains information about a report we decode and set the params,
   * otherwise we set the first report as the default.
   */
  componentDidMount() {
    const { page } = queryString.parse(window.location.search);
    if (page) {
      this.decodeUrlAndSetParams();
    } else {
      const [defaultPage] = Object.keys(this.props.reportsJson);
      this.props.setActiveReport(this.props.active || defaultPage);
      this.setDefaultParamValues(defaultPage);
    }
  }

  /**
   * Sets query url based on params used in form.
   */
  setQueryUrl(active, obj = null) {
    const params = obj || this.props.reports.get(active);
    this.props.setReportParameters({
      key: active,
      value: params,
    });

    const paramsListed = queryString.stringify(
      {
        page: active,
        ...params,
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
    const { active, reports } = this.props;
    if (reports.get(active)[param] !== value) {
      const data = {
        ...reports.get(active),
        [param]: value,
      };
      this.setQueryUrl(active, data);
    }
  }

  /**
   * Update date information based on the provided data and schema.
   * After thats done, update query url.
   *
   * @param param
   * @param data
   */
  setDateValue(param, data) {
    const { reports, active } = this.props;
    const items = reports.get(active);
    const valuesToUpdate = Object.entries(param).reduce((acc, [key, value]) => {
      const sanitizedDate = parseDate(data[key]);
      if (items[value] !== sanitizedDate) {
        return {
          ...acc,
          [value]: sanitizedDate,
        };
      }
      return acc;
    }, {});
    this.setQueryUrl(active, { ...items, ...valuesToUpdate });
  }

  /**
   * After page is selected for the first time, take default values out of forms.json
   * for each field, and set it in state.
   */
  setDefaultParamValues(page, obj = {}) {
    const defaultParams = this.reduceParams(page, (name, curr) =>
      name.map((n) => ({
        [n]:
          obj[n] ||
          handleDefaultValue(n, {
            ...curr,
            accountId: this.props.account.get('id'),
          }),
      })),);
    this.setQueryUrl(page, Object.assign(...defaultParams));
  }

  /**
   * return the list of parameters for a given page.
   * @param page
   * @return {*}
   */
  getPageValidFields(page) {
    return this.reduceParams(page, (name) => name.map((n) => n));
  }

  /**
   * Get list of available reports.
   * @return {{label: string, value: string}[]}
   */
  getReportList() {
    return Object.entries(this.props.reportsJson).reduce((acc, [pageKey, value]) => {
      const deniedUserRoles = reportAccessPermissions[pageKey]?.denyRoles;
      if (deniedUserRoles?.includes(this.props.userRole)) return acc;
      return [
        ...acc,
        {
          value: pageKey,
          label: value.title,
        },
      ];
    }, []);
  }

  /**
   * Interact with parameters schema using a reducer.
   *
   * @param page
   * @param callback
   * @return array
   */
  reduceParams(page, callback) {
    return this.props.reportsJson[page].parameters.reduce((acc, curr) => {
      const name = typeof curr.name === 'string' ? [curr.name] : Object.values(curr.name);
      return [...acc, ...callback(name, curr)];
    }, []);
  }

  /**
   * Decode url query params and set the state.
   * Used when URL with query params is set when initially opening page.
   */
  decodeUrlAndSetParams() {
    const query = window.location.search;
    if (!query || query === '') return;

    const { page, ...params } = queryString.parse(query, {
      arrayFormat: 'bracket',
    });

    if (!page) return;

    const validPageFields = this.getPageValidFields(page);
    const finalListOfParams = Object.assign(
      ...validPageFields.map((field) => ({ [field]: params[field] })),
    );
    this.props.setActiveReport(page);
    this.props.setReportParameters({
      key: page,
      value: finalListOfParams,
    });
  }

  /**
   * Change the page & set the default parameters for that page.
   * @param page
   */
  changePage(page) {
    const currentOptions = this.props.reports.get(this.props.active);
    const nextOptions = this.props.reports.get(page);
    this.props.setActiveReport(page);

    const merge =
      nextOptions &&
      Object.entries(nextOptions).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: currentOptions[key] || value,
        }),
        {},
      );
    nextOptions ? this.setQueryUrl(page, merge) : this.setDefaultParamValues(page, currentOptions);
  }

  render() {
    const { active, account, reports, reportsJson, timezone, shouldHideMultiAccount } = this.props;
    const params = reports.get(active);
    const parameters = {
      ...reportsJson,
      defaultComponents,
    };

    if (!params) {
      return null;
    }

    const componentsProps = ({ name, component, helpers, defaultValue }) =>
      ({
        dateRange: {
          popover: true,
          start: params[name.start],
          end: params[name.end],
          timezone,
          helpers: helpers && getRangeFromList(helpers),
          defaultValue:
            defaultValue && typeof defaultValue === 'string'
              ? getRangeFromList([defaultValue])[0]
              : defaultValue,
          onChange: (value) => this.setDateValue(name, value),
        },
        dropdown: {
          selected: params[name],
          onChange: (value) => this.setParam(name, value),
        },
        multiSelectAccount: {
          selected: params[name],
          hide: shouldHideMultiAccount,
          defaultValue: [account.get('id')],
          onChange: (value) => this.setParam(name, value),
        },
        toggle: {
          checked: params[name] === 1,
          onChange: (value) => this.setParam(name, +value.target.checked),
        },
        selectPill: {
          selected: params[name],
          onChange: (value) => this.setParam(name, value, true),
        },
      }[component]);
    const activeComponents = reportsJson[active].parameters.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.component]: {
          ...curr,
          ...componentsProps(curr),
        },
      }),
      {},
    );

    return (
      <div className={styles.wrapper}>
        <div className={styles.navDropdownListWrapper}>
          <NavDropdownList
            onChange={this.changePage}
            options={this.getReportList()}
            selected={active}
          />
        </div>
        <FormGenerator parameters={parameters} page={active} componentProps={activeComponents} />
        <ModeReport
          reportId={parameters[active].reportId}
          reportActionTitle={parameters[active].title}
          reportActionAccountName={account.get('name')}
          parameters={{
            ...params,
            // eslint-disable-next-line camelcase
            Account_name: params.Account_name || account.get('id'),
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
  reportsJson: PropTypes.shape({}).isRequired,
  shouldHideMultiAccount: PropTypes.bool.isRequired,
  userRole: PropTypes.string.isRequired,
};

const mapStateToProps = ({ entities, auth, intelligenceReports, featureFlags }) => {
  // Convert the featureFlagged reports array into a hash map
  const reportsJson = isFeatureEnabledSelector(
    featureFlags.get('flags'),
    'intelligence-page-reports-json',
  )
    .toJS()
    .reports.reduce(
      (json, report) => ({
        ...json,
        [report.urlSlug]: report,
      }),
      {},
    );
  const multiSelectOptions = featureFlags.getIn(['flags', 'multi-account-select']);
  return {
    active: intelligenceReports.get('active'),
    reports: intelligenceReports.get('reports'),
    account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
    reportsJson,
    shouldHideMultiAccount: !(multiSelectOptions && multiSelectOptions.size > 1),
    timezone: auth.get('timezone'),
    userRole: auth.get('role'),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setActiveReport,
      setReportParameters,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ReportParametersForm);
