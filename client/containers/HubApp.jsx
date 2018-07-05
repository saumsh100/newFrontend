
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import NavRegionContainer from '../containers/NavRegionContainer';
import MainRegionContainer from '../containers/MainRegionContainer';
import NavList from '../components/NavList/Electron';
import PageHeading from '../components/PageHeading';
import SubTabs from '../components/SubTabs';
import AlertContainer from '../containers/AlertContainer';
import { TOOLBAR_LEFT, TOOLBAR_RIGHT } from '../util/hub';
import styles from './styles.scss';

function HubApp(props) {
  const {
    location, children, isSearchCollapsed, showContent, toolbarPosition,
  } = props;

  const isLoginPage = location.pathname.includes('login');

  if (isLoginPage) {
    return <div>{children}</div>;
  }

  return (
    <div>
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
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
