import Dropzone from 'react-dropzone';
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Loading from 'react-loader';

export default function DropzoneWrapper({ children, onDrop, multiple, loaded, accept }) {
  return (<Dropzone onDrop={onDrop} multiple={multiple} accept={accept} className={styles.dropzone}>
    <Loading loaded={loaded}>
      {children}
    </Loading>
  </Dropzone>);
}

DropzoneWrapper.propTypes = {
  children: PropTypes.node,
  onDrop: PropTypes.func,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  loaded: PropTypes.bool,
};

DropzoneWrapper.defaultProps = {
  onDrop: () => {},
  multiple: false,
  accept: '.jpg, .png',
  loaded: true,
};
