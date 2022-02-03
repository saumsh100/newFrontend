
import React, { Component } from 'react';
import { Card, Button, Link } from '../../library';
import styles from '../styles.scss';
import CopyrightFooter from '../../Login/CopyrightFooter/index';

export default function RecoveryTokenInvalid(){
    return (
      <div className={styles.backDrop}>
        <Card className={styles.loginForm}>
          <div className={styles.logoContainer}>
            <img className={styles.loginLogo} src="/images/logo_black.png" alt="CareCru Logo" />
          </div>
          <div>
            <div className={styles.textError}>The recovery token is invalid or has already been used!</div>            
            <Link to={'/login'} >
              <Button className={styles.displayCenter}>
                Return to Login
              </Button>
            </Link>
          </div>
        </Card>
        <CopyrightFooter />
      </div>
    );
}