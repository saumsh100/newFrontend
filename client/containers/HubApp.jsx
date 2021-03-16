import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import NavRegionContainer from './NavRegionContainer';
import MainRegionContainer from './MainRegionContainer';
import NavList from '../components/NavList/Electron';
import PageHeading from '../components/PageHeading';
import SubTabs from '../components/SubTabs';
import AlertContainer from './AlertContainer';
import { TOOLBAR_LEFT, TOOLBAR_RIGHT } from '../util/hub';
import { locationShape } from '../components/library/PropTypeShapes/routerShapes';
import styles from './styles.scss';

function HubApp({ location, children, isSearchCollapsed, showContent, toolbarPosition }) {
  const isLoginPage = location.pathname.includes('login');

  if (isLoginPage) {
    return <div>{children}</div>;
  }

  return (
    <div>
      <DocumentTitle title="CareCru Hub" />
      <div
        className={classNames(styles.hubContentContainer, {
          [styles.left]: toolbarPosition === TOOLBAR_LEFT,
          [styles.right]: toolbarPosition === TOOLBAR_RIGHT,
          [styles.active]: showContent,
        })}
      >
        <PageHeading />
        <MainRegionContainer position={toolbarPosition}>
          {isSearchCollapsed && (
            <div className={styles.subTabs}>
              <SubTabs location={location} />
            </div>
          )}
          <div
            className={classNames(styles.mainRegionChildren, {
              [styles.borderBottomRight]: toolbarPosition === TOOLBAR_LEFT,
              [styles.borderBottomLeft]: toolbarPosition === TOOLBAR_RIGHT,
            })}
          >
            {children}
            <AlertContainer />
          </div>
        </MainRegionContainer>
      </div>
      <NavRegionContainer>
        <NavList location={location} />
      </NavRegionContainer>
    </div>
  );
}

HubApp.propTypes = {
  children: PropTypes.node,
  location: PropTypes.shape(locationShape),
  isSearchCollapsed: PropTypes.bool.isRequired,
  showContent: PropTypes.bool.isRequired,
  toolbarPosition: PropTypes.oneOf([TOOLBAR_LEFT, TOOLBAR_RIGHT]),
};

HubApp.defaultProps = {
  toolbarPosition: TOOLBAR_LEFT,
  children: null,
  location: null,
};

function mapStateToProps({ toolbar, electron }) {
  return {
    isSearchCollapsed: toolbar.get('isSearchCollapsed'),
    showContent: electron.get('showContent'),
    toolbarPosition: electron.get('toolbarPosition'),
  };
}

export default connect(mapStateToProps)(HubApp);
