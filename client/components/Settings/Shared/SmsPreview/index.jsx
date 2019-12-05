
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cache } from '@carecru/isomorphic';
import { SMSPreview } from '../../../library';
import { httpClient } from '../../../../util/httpClient';
import styles from './styles.scss';

const formatPhoneNumber = phone =>
  `+1 (${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8, 4)}`;

// Default expiry is 30 seconds
const emailPreviewCache = new Cache({ defaultExpiryMs: 1000 * 30 });

// Needs to be able to cache...
const getText = url =>
  new Promise((resolve) => {
    const cachedData = emailPreviewCache.get(url);
    if (cachedData) return resolve(cachedData);

    // Make request to fetch if there is no cachedData
    return httpClient()
      .get(url)
      .then(({ data }) => {
        emailPreviewCache.set(url, data);
        return resolve(data);
      });
  });

export default class SmsPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: null,
    };

    this.fetchText = this.fetchText.bind(this);
  }

  componentDidMount() {
    return this.fetchText(this.props.url);
  }

  componentDidUpdate(prevProps) {
    const newUrl = this.props.url;
    if (newUrl !== prevProps.url) {
      this.fetchText(newUrl);
    }
  }

  fetchText(url) {
    return getText(url).then((text) => {
      this.setState({ text });
    });
  }

  render() {
    const { account } = this.props;
    const { text } = this.state;

    const smsPhoneNumber =
      account.twilioPhoneNumber ||
      account.destinationPhoneNumber ||
      account.phoneNumber ||
      '+1112223333';

    return (
      <div className={styles.smsPreviewWrapper}>
        <SMSPreview from={formatPhoneNumber(smsPhoneNumber)} message={text} />
      </div>
    );
  }
}

SmsPreview.propTypes = {
  url: PropTypes.string.isRequired,
  account: PropTypes.shape({
    twilioPhoneNumber: PropTypes.string.isRequired,
    destinationPhoneNumber: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
};
