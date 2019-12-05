
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import signModeUrl from './signModeUrl';
import Card from '../library/ui-kit/Card';
import styles from './styles.scss';

class ModeReport extends Component {
  constructor(props) {
    super(props);
    this.iframeRef = createRef();
    this.state = {
      loading: true,
      url: null,
    };
  }

  componentDidMount() {
    this.signUrl(this.props);

    this.iframeRef.current.addEventListener(
      'load',
      () => {
        setTimeout(() => {
          this.setState({ loading: false });
        }, 1000);
      },
      true,
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.reportId !== prevProps.reportId ||
      !isEqual(this.props.parameters, prevProps.parameters)
    ) {
      this.signUrl(this.props);
    }
  }

  async signUrl(options) {
    try {
      this.setState({ loading: true });
      const url = await signModeUrl(options);
      this.setState({ url });
    } catch (err) {
      console.log('WAITING TILL FINAL IMPLEMENTATION TO DECIDE WHAT TO DO HERE');
    }
  }

  render() {
    const { reportActionTitle, reportActionAccountName } = this.props;

    return (
      <Card
        runAnimation
        className={styles.report}
        contentStyle={styles.contentStyle}
        loaded={!this.state.loading}
        message={`fetch ${reportActionTitle} data`}
        accountName={reportActionAccountName}
      >
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe
          src={this.state.url}
          width="100%"
          height="100%"
          frameBorder="0"
          ref={this.iframeRef}
        />
      </Card>
    );
  }
}

ModeReport.propTypes = {
  reportId: PropTypes.string.isRequired,
  parameters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
  ),
  reportActionTitle: PropTypes.string,
  reportActionAccountName: PropTypes.string,
};

ModeReport.defaultProps = {
  reportActionTitle: null,
  parameters: {},
  reportActionAccountName: null,
};

export default ModeReport;
