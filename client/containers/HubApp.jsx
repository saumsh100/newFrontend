import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import NavRegionContainer from './NavRegionContainer';
import MainRegionContainer from './MainRegionContainer';
import PageHeading from '../components/PageHeading';
import SubTabs from '../components/SubTabs';
import AlertContainer from './AlertContainer';
import { locationShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

function HubApp({ location, children, isSearchCollapsed }) {
  const isLoginPage = location.pathname.includes('login');

  if (isLoginPage) {
    return <div>{children}</div>;
  }

  return (
    <div>
      <DocumentTitle title="CareCru Hub" />
      <div className={classNames(styles.hubContentContainer)}>
        <PageHeading />
        <MainRegionContainer>
          {isSearchCollapsed && (
            <div className={styles.subTabs}>
              <SubTabs location={location} />
            </div>
          )}
          <div className={classNames(styles.mainRegionChildren)}>
            {children}
            <AlertContainer />
          </div>
        </MainRegionContainer>
      </div>
      <NavRegionContainer>{/* <NavList location={location} /> */}</NavRegionContainer>
    </div>
  );
}

HubApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape(locationShape),
  isSearchCollapsed: PropTypes.bool.isRequired,
};

HubApp.defaultProps = {
  children: null,
  location: null,
};

function mapStateToProps({ toolbar }) {
  return {
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
  };
}

export default connect(mapStateToProps)(HubApp);
