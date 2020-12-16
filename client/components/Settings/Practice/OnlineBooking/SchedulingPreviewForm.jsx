
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogBox, Loading } from '../../../library/';
import FormButton from '../../../library/Form/FormButton';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import styles from './styles.scss';

export default function SchedulingPreviewForm({ activeAccount }) {
  const [viewingPreview, setViewingPreview] = useState(false);
  const [loadingIFrame, setloadingIFrame] = useState(false);

  const closePreview = () => setViewingPreview(false);
  const openPreview = () => setViewingPreview(true);

  return (
    <Fragment>
      <div className={styles.formContainer_pickerField}>
        <label>
          Test run your online scheduling widget without it being published on your website
        </label>
      </div>
      <FormButton
        title="Preview"
        className={styles.previewWidgetButton}
        onClick={() => {
          openPreview();
          setloadingIFrame(true);
        }}
      />
      <DialogBox
        title="Online Scheduling Widget Preview"
        active={viewingPreview}
        onEscKeyDown={closePreview}
        onOverlayClick={closePreview}
        className={styles.widgetPreviewDialogBox}
      >
        {loadingIFrame && <Loading />}
        {viewingPreview && (
          <iframe
            width="100%"
            height="100%"
            style={loadingIFrame ? { display: 'none' } : {}}
            title="Online Scheduling Widget Preview"
            src={`${window.location.protocol}//my.${window.location.hostname}/widgets/${activeAccount.id}/app/book`}
            onLoad={() => setloadingIFrame(false)}
          />
        )}
      </DialogBox>
    </Fragment>
  );
}

SchedulingPreviewForm.propTypes = {
  activeAccount: PropTypes.shape(AccountShape).isRequired,
};
