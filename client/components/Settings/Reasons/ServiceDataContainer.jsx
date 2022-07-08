import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import classNames from 'classnames';
import ServiceDataItem from './ServiceDataItem';
import { updateEntityRequest, deleteEntityRequest } from '../../../thunks/fetchEntities';
import SettingsCard from '../Shared/SettingsCard';
import { Card, IconButton, Tab, Tabs, Tooltip } from '../../library';
import EnabledFeature from '../../library/EnabledFeature';
import ReasonWeeklyHoursWrapper from './ReasonHours/Wrapper';
import styles from './styles.scss';

const defaultDeletePopover =
  "This reason can't be deleted because it is set as default. Update the default reason to delete this.";

class ServiceDataContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };
    this.updateService = this.updateService.bind(this);
    this.deleteService = this.deleteService.bind(this);
  }

  updateService(modifiedService, alert) {
    this.props.updateEntityRequest({
      key: 'services',
      model: modifiedService,
      alert,
    });
  }

  deleteService() {
    const { serviceId } = this.props;
    const deleteService = window.confirm('Are you sure you want to delete this reason?');
    if (deleteService) {
      this.props.deleteEntityRequest({
        key: 'services',
        id: serviceId,
      });
      this.props.setServiceId({ id: null });
    }
  }

  render() {
    const { services, serviceId, practitioners } = this.props;

    if (!services || !practitioners) {
      return null;
    }

    const selectedService = serviceId ? services.get(serviceId) : services.first();
    let component = null;
    if (selectedService) {
      const practitionerIds = selectedService.get('practitioners');
      component = (
        <SettingsCard
          title={selectedService.get('name')}
          headerClass={styles.serviceDataHeader}
          bodyClass={styles.serviceDataBody}
          rightActions={
            selectedService.isDefault ? (
              <Tooltip
                trigger={['hover']}
                overlay={<div className={styles.tooltipWrapper}>{defaultDeletePopover}</div>}
                placement="top"
                overlayClassName="light"
              >
                <div
                  data-test-id="removeService"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.keyCode === 13 && this.deleteService()}
                >
                  <IconButton icon="trash" iconType="solid" disabled />
                </div>
              </Tooltip>
            ) : (
              <div
                data-test-id="removeService"
                onClick={this.deleteService}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.keyCode === 13 && this.deleteService()}
              >
                <IconButton icon="trash" iconType="solid" />
              </div>
            )
          }
          subHeader={
            <Tabs index={this.state.index} onChange={(index) => this.setState({ index })}>
              <Tab
                label="Reason Settings"
                data-test-id="tab_practitionerBasicData"
                className={classNames(styles.tab, {
                  [styles.tab_active]: this.state.index === 0,
                })}
              />
              <Tab
                label="Override Availabilities"
                data-test-id="tab_practitionerOfficeHours"
                className={classNames(styles.tab, {
                  [styles.tab_active]: this.state.index === 1,
                })}
              />
            </Tabs>
          }
        >
          <Tabs index={this.state.index} noHeaders contentClass={styles.content}>
            <Tab label=" ">
              <ServiceDataItem
                key={`${selectedService.get('id')}basicdata`}
                service={selectedService}
                onSubmit={this.updateService}
                practitionerIds={practitionerIds}
                practitioners={practitioners}
              />
            </Tab>
            <Tab label=" ">
              <EnabledFeature
                predicate={({ flags }) => flags.get('reason-schedule-component')}
                render={() => <ReasonWeeklyHoursWrapper reason={selectedService} />}
              />
            </Tab>
          </Tabs>
        </SettingsCard>
      );
    }

    return (
      <Card className={styles.servicesDataContainer} noBorder>
        {component}
      </Card>
    );
  }
}

ServiceDataContainer.propTypes = {
  updateEntityRequest: PropTypes.func.isRequired,
  deleteEntityRequest: PropTypes.func.isRequired,
  services: PropTypes.instanceOf(Map).isRequired,
  practitioners: PropTypes.instanceOf(Map).isRequired,
  serviceId: PropTypes.string.isRequired,
  setServiceId: PropTypes.func.isRequired,
};

const mapActionsToProps = (dispatch) =>
  bindActionCreators(
    {
      updateEntityRequest,
      deleteEntityRequest,
    },
    dispatch,
  );

export default connect(null, mapActionsToProps)(ServiceDataContainer);
