
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import signModeUrl from './signModeUrl';
import styles from './styles.scss';

class ModeReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      url: null,
    };
  }

  componentDidMount() {
    this.signUrl(this.props);
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
      const url = await signModeUrl(options);
      this.setState({
        url,
        loading: false,
      });
    } catch (err) {
      console.log('WAITING TILL FINAL IMPLEMENTATION TO DECIDE WHAT TO DO HERE');
    }
  }

  render() {
    return (
      <div className={styles.report}>
        {this.state.loading ? (
          'Loading...'
        ) : (
          <iframe
            title={`Mode Report ${this.state.url}`}
            src={this.state.url}
            width="100%"
            height="100%"
            frameBorder="0"
          />
        )}
      </div>
    );
  }
}

ModeReport.propTypes = {
  reportId: PropTypes.string.isRequired,
  parameters: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

ModeReport.defaultProps = { parameters: {} };

export default ModeReport;
