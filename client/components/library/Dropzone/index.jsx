
import Dropzone from 'react-dropzone';
import React, { PropTypes } from 'react';
import styles from './styles.scss';
import Loading from 'react-loader';

export default function DropzoneWrapper({
  children,
  onDrop,
  multiple,
  loaded,
  accept,
}) {
  return (
    <div onChange={e => e.stopPropagation()}>
      <Dropzone
        onDrop={onDrop}
        multiple={multiple}
        accept={accept}
        className={styles.dropzone}
      >
        <Loading loaded={loaded}>{children}</Loading>
      </Dropzone>
    </div>
  );
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
  accept: 'image/jpeg, image/png',
  loaded: true,
};
