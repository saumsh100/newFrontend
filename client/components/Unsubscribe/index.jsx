import React, { Component, PropTypes } from 'react';
import { Card, IconButton } from '../library';
import styles from './styles.scss';
import CopyrightFooter from '../Login/CopyrightFooter/index';
import { getParameterByName } from '../ConfirmedAppointment';

export default function UnSubscribe(props) {

  let params = getParameterByName('params');

  params = Buffer.from(params, 'base64').toString('utf8');

  params = JSON.parse(params);

  const {
    address,
    facebookUrl,
    phoneNumber,
    email,
    name,
    fullLogoUrl,
  } = params;

  const urlCheck = /(http(s?))\:\/\//gi;

  const facebook = facebookUrl ? `https://${facebookUrl.replace(urlCheck, '')}` : null;

  const displayFacebook = facebook && facebookUrl !== '' ? (<a className={styles.button} href={facebook}>
    <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle fill="#ff715a" cx="20" cy="20" r="20"></circle><path fill="#ffffff" d="M16.38,17.46h1.55V16a4,4,0,0,1,.5-2.32,2.76,2.76,0,0,1,2.41-1.13,9.74,9.74,0,0,1,2.78.28l-.39,2.3A5.23,5.23,0,0,0,22,14.89c-.6,0-1.14.22-1.14.82v1.75h2.47l-.17,2.24h-2.3v7.8H17.93V19.7H16.38Z"></path></svg>
  </a>) : (<img
    className={styles.loginLogo}
    src="/images/carecru_logo.png"
    alt="CareCru Logo"
  />);


  return (<div className={styles.backDrop}>
      <Card className={styles.loginForm}>
        <div className={styles.topContainer}>
          <div className={styles.topText}>
            <img
              className={styles.careLogo}
              src="/images/logo_black_1.png"
              alt="CareCru Logo"
            />
            <br />
            <img
              className={styles.donnaLogo}
              src={fullLogoUrl}
              alt="CareCru Logo"
            />
            <div className={styles.text}>Sorry To See You Go!</div>
            <div className={styles.bottomText}>You have been successfully unsubscribed.</div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.logo}>
            {name}
          </div>
          <div className={styles.addressText}>{address.street}</div>
          <div className={styles.addressText2}>{address.city}, {address.state}</div>
          <br />
          <div className={styles.addressText}>{phoneNumber}</div>
          <div className={styles.addressText}>{email}</div>
          {displayFacebook}
          <div className={styles.footer}>
            Copyright © 2017 CareCru Inc. All rights reserved.
          </div>
        </div>
      </Card>
    </div>
  )
}
