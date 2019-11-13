
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Cache } from '@carecru/isomorphic';
import styles from './styles.scss';
import { httpClient } from '../../../../util/httpClient';

// Default expiry is 30 seconds
const emailPreviewCache = new Cache({ defaultExpiryMs: 1000 * 30 });

// TODO: refactor out a get html api function

// Needs to be able to cache...
const getPreview = url =>
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

const EMAIL_SCALE = 0.75;

// This accounts for images not loading in time to set height exactly
const AVERAGE_IMAGE_HEIGHT = 500;

export default class EmailPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      height: 500,
    };

    this.fetchPreview = this.fetchPreview.bind(this);
  }

  componentWillMount() {
    const { url } = this.props;
    return this.fetchPreview(url);
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props;
    const { url } = nextProps;
    if (oldProps.url !== url) {
      return this.fetchPreview(url);
    }
  }

  fetchPreview(url) {
    this.setState({ loading: true });
    return getPreview(url).then((html) => {
      // document.write was best way to ensure accessibility of html tag
      // therefore we need to wipe it when it switches
      this.iframe.contentWindow.document.getElementsByTagName('head')[0].innerHTML = '';
      this.iframe.contentWindow.document.getElementsByTagName('body')[0].innerHTML = '';
      this.iframe.contentWindow.document.write(html);

      // Now insert the custom scaling css into the html style
      // Without this, the emails look huge
      const iHtml = this.iframe.contentWindow.document.getElementsByTagName('center')[0];
      iHtml.style.transform = `scale(${EMAIL_SCALE})`;
      iHtml.style.transformOrigin = 'top center';

      const anchors = Array.from(iHtml.getElementsByTagName('a'));
      anchors.forEach(a => (a.onclick = e => e.preventDefault()));

      // Customize iframe
      this.props.customizeIframe(this.iframe.contentWindow, html);

      // Set container with proper html so that the iframe is not scrollable
      // We want the overall container to be scrollable
      const height = iHtml.offsetHeight * EMAIL_SCALE + AVERAGE_IMAGE_HEIGHT;
      this.setState({
        loading: false,
        height,
      });
    });
  }

  render() {
    const { height } = this.state;
    return (
      <div style={{ height: `${height}px` }} className={styles.iframeWrapper}>
        <iframe ref={node => (this.iframe = node)} className={styles.iframe} />
      </div>
    );
  }
}

EmailPreview.propTypes = { url: PropTypes.string.isRequired };
