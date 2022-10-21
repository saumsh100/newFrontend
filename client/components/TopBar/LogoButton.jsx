import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import loadable from '@loadable/component';
import styles from './reskin-styles.scss';
import MicroFrontendRenderer from '../../micro-front-ends/MicroFrontendRenderer';

// eslint-disable-next-line import/no-unresolved
const EmPracticeSwitcher = loadable(() => import('EM_MFE/EmPracticeSwitcher'));

const LogoButton = ({ enterpriseManagementPhaseTwoActive, imgSrc, description }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={classNames(styles.logoWrapperButton, {
          [styles.logoWrapperButton_emAccount]: enterpriseManagementPhaseTwoActive,
        })}
      >
        <div className={styles.logoImage}>
          <img className={styles.logoImageImage} src={imgSrc} alt={description} />
        </div>
      </button>
      {isDropdownOpen && (
        <MicroFrontendRenderer
          load={enterpriseManagementPhaseTwoActive}
          component={<EmPracticeSwitcher wrapperRef={wrapperRef} />}
          className={styles.emSwitcher}
        />
      )}
    </>
  );
};

LogoButton.propTypes = {
  enterpriseManagementPhaseTwoActive: PropTypes.bool.isRequired,
  imgSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default LogoButton;
