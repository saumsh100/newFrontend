
import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import VButton from '../Button';
import { omitTypes } from '../../Utils';
import { Icon } from '../../library';
import styles from './fb-login-button.scss';

window.oauthHandler = (data) => {
  console.log(data);
};

const DIALOG_URL = 'https://www.facebook.com/dialog/oauth';

const getApiPort = () => process.env.API_SERVER_PORT || window.location.port;

/**
 * Absolute path to api without proxy port
 * @param {string} path - relative path
 * @returns {string} - absolute path
 */
const getUrl = (path = '') => {
  const { hostname } = window.location;
  const port = getApiPort();
  const portPart = port ? `:${port}` : '';
  return `http://${hostname}${portPart}${path}`;
};

const getDialogUrl = (appId, scope) => {
  const options = queryString.stringify({
    client_id: appId,
    display: 'popup',
    redirect_uri: getUrl('/oauth/facebook'),
    ...(scope && scope.length
      ? {
        scope: Array.isArray(scope) ? scope.join(',') : scope,
      }
      : {}),
  });

  return `${DIALOG_URL}?${options}`;
};

const openLoginDialog = ({ appId, width, height, scope }) => () => {
  const dialogWindow = window.open(
    getDialogUrl(appId, scope),
    'Login with Facebook',
    `width=${width},height=${height}`,
  );

  dialogWindow.onload = () => {
    console.log(dialogWindow.location);
  };
};

const FBLoginButton = props => (
  <VButton
    {...omitTypes(FBLoginButton, props)}
    className={`${styles['fb-button']} ${props.className}`}
    onClick={openLoginDialog(props)}
  >
    <Icon icon="facebook-official" className={styles.icon} size={2} />
    Login with Facebook
  </VButton>
);

FBLoginButton.defaultProps = {
  className: '',
  width: 640,
  height: 400,
  scope: false,
};

FBLoginButton.propTypes = {
  className: PropTypes.string,
  appId: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  scope: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
};

export default FBLoginButton;
