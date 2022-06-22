import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogBox, Loading } from '../../../library';
import FormButton from '../../../library/Form/FormButton';
import AccountShape from '../../../library/PropTypeShapes/accountShape';
import styles from './styles.scss';

export default function SchedulingPreviewForm({ activeAccount, domainURL, onlineSchedulerFlag }) {
  const [viewingPreview, setViewingPreview] = useState(false);
  const [loadingIFrame, setloadingIFrame] = useState(false);

  const closePreview = () => setViewingPreview(false);
  const openPreview = () => setViewingPreview(true);

  const hostname =
    window.location.hostname.split('.').length === 3
      ? window.location.hostname.split('.').slice(1).join('.')
      : window.location.hostname;
  const subDomain = process.env.MY_SUBDOMAIN;

  const domainNameURL = onlineSchedulerFlag
    ? domainURL
    : `${window.location.protocol}//${subDomain}.${hostname}`;

  return (
    <>
      <div className={styles.formContainer_pickerField}>
        Test run your online scheduling widget without it being published on your website
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
            src={`${domainNameURL}/widgets/${activeAccount.id}/app/book`}
            onLoad={() => setloadingIFrame(false)}
          />
        )}
      </DialogBox>
    </>
  );
}

SchedulingPreviewForm.propTypes = {
  activeAccount: PropTypes.shape(AccountShape).isRequired,
  domainURL: PropTypes.string.isRequired,
  onlineSchedulerFlag: PropTypes.bool.isRequired,
};
