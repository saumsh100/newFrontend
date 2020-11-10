
import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import { connect } from 'react-redux';
import DialogBox from '../../../library/DialogBox';
import WaitlistTableWithActions from './WaitlistTableWithActions';
import Account from '../../../../entities/models/Account';
import { batchUpdateFactory, mergeData } from './helpers';
import DraftMessage from './WaitlistMessage/DraftMessage';
import ResponseMessage from './WaitlistMessage/ResponseMessage';
import WaitlistForm from './WaitlistForm';
import {
  loadMassTextTemplate,
  sendMassMessage,
  waitlistRecipientsAnalyzer,
} from '../../../../thunks/waitlist';
import { Create as CreateWaitSpot } from '../../../GraphQLWaitlist';
import UpdateWaitSpot from '../../../GraphQLWaitlist/updateWaitSpot';
import styles from '../styles.scss';

export const WAITLIST_STATE = {
  initial: 0,
  draft: 1,
  sent: 2,
  form: 3,
};

const NextWaitlist = ({ account, ...props }) => {
  const batchUpdate = useCallback(
    (state = false, waitListIDs) => batchUpdateFactory(props.waitlist)(state, waitListIDs),
    [props.waitlist],
  );
  const [selectedWaitSpot, setSelectedWaitSpot] = useState({});
  const isNewWaitSpot = Object.keys(selectedWaitSpot).length === 0;
  const [selectedWaitlistMap, setSelectedWaitlistMap] = useState(batchUpdate);
  const [waitlistState, setWaitListState] = useState(WAITLIST_STATE.initial);
  const [textMessage, setTextMessage] = useState('');
  const [conversionAnalyzer, setConversionAnalyzer] = useState({ success: [],
    errors: [] });
  const [sentMessages, setSentMessages] = useState({ success: [],
    errors: [] });

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const defaultUnit = account.get('unit');

  useEffect(() => {
    setSelectedWaitlistMap(batchUpdate());
  }, [batchUpdate]);

  const loadDefaultTemplate = useCallback(() => {
    loadMassTextTemplate(account.toJS()).then(({ data }) => {
      setTextMessage((prevTextMessage) => {
        if (!prevTextMessage) {
          return data;
        }
        if (prevTextMessage !== data) {
          return prevTextMessage;
        }
        return data;
      });
    });
  }, [account]);

  useEffect(() => {
    loadDefaultTemplate();
  }, [account, loadDefaultTemplate]);

  const goToSendMassMessage = useCallback(
    (ids) => {
      waitlistRecipientsAnalyzer(account.get('id'), ids).then(({ data }) => {
        setConversionAnalyzer(data);
        setWaitListState(WAITLIST_STATE.draft);
      });
    },
    [account],
  );

  const handleSendMessage = useCallback(() => {
    setIsSendingMessage(true);
    const dataset = groupBy([...conversionAnalyzer.success, ...conversionAnalyzer.errors], 'id');
    sendMassMessage(account.get('id'), Object.keys(dataset), textMessage).then(({ data }) => {
      const sentData = {
        errors: mergeData(data.errors, dataset),
        success: mergeData(data.success, dataset),
      };

      setSentMessages(sentData);
      setIsSendingMessage(false);
      setWaitListState(WAITLIST_STATE.sent);
    });
  }, [account, conversionAnalyzer, textMessage]);

  const handleSubmit = callback => ({ patient, patientUser, ...values }) => {
    callback({
      variables: {
        input: {
          ...values,
          accountId: account.get('id'),
          patientId: patient && patient.id,
          patientUserId: patientUser && patientUser.id,
          id: selectedWaitSpot.id,
        },
      },
    });

    resetEditForm();
  };

  const handleEdit = id => () => {
    const waitSpot = props.waitlist.find(({ ccId }) => ccId === id);
    setSelectedWaitSpot(waitSpot);
    setWaitListState(WAITLIST_STATE.form);
  };

  const resetEditForm = () => {
    setSelectedWaitSpot({});
    setWaitListState(WAITLIST_STATE.initial);
  };

  return (
    <>
      <WaitlistTableWithActions
        {...props}
        batchUpdate={batchUpdate}
        onEdit={handleEdit}
        goToAddWaitListForm={() => setWaitListState(WAITLIST_STATE.form)}
        goToSendMassMessage={goToSendMassMessage}
        setSelectedWaitlistMap={setSelectedWaitlistMap}
        selectedWaitlistMap={selectedWaitlistMap}
      />
      <DialogBox
        title="Waitlist"
        active={waitlistState === WAITLIST_STATE.draft}
        bodyStyles={styles.dialogBodyList}
        onEscKeyDown={() => setWaitListState(WAITLIST_STATE.initial)}
        onOverlayClick={() => setWaitListState(WAITLIST_STATE.initial)}
        type="large"
      >
        <DraftMessage
          {...props}
          conversionAnalyzer={conversionAnalyzer}
          goToWaitlistTable={() => setWaitListState(WAITLIST_STATE.initial)}
          handleSendMessage={handleSendMessage}
          textMessage={textMessage}
          selectedWaitlistMap={selectedWaitlistMap}
          setTextMessage={setTextMessage}
          isSendingMessage={isSendingMessage}
        />
      </DialogBox>
      <DialogBox
        title="Waitlist"
        active={waitlistState === WAITLIST_STATE.sent}
        bodyStyles={styles.dialogBodyList}
        onEscKeyDown={() => setWaitListState(WAITLIST_STATE.initial)}
        onOverlayClick={() => setWaitListState(WAITLIST_STATE.initial)}
        type="large"
      >
        <ResponseMessage
          {...props}
          sentMessages={sentMessages}
          goToWaitlistTable={() => {
            setWaitListState(WAITLIST_STATE.initial);
            loadDefaultTemplate();
          }}
          textMessage={textMessage}
          selectedWaitlistMap={selectedWaitlistMap}
        />
      </DialogBox>
      {waitlistState === WAITLIST_STATE.form && (
        <DialogBox
          title="Waitlist"
          active={waitlistState === WAITLIST_STATE.form}
          bodyStyles={styles.dialogBodyList}
          onEscKeyDown={() => setWaitListState(WAITLIST_STATE.initial)}
          onOverlayClick={() => setWaitListState(WAITLIST_STATE.initial)}
          type="large"
        >
          <UpdateWaitSpot>
            {updateWaitSpotHandler => (
              <CreateWaitSpot>
                {createWaitSpotHandler => (
                  <WaitlistForm
                    isNewWaitSpot={isNewWaitSpot}
                    timezone={account.get('timezone')}
                    initialState={selectedWaitSpot}
                    handleSubmit={handleSubmit(
                      isNewWaitSpot ? createWaitSpotHandler : updateWaitSpotHandler,
                    )}
                    goToWaitlistTable={resetEditForm}
                    defaultUnit={defaultUnit}
                  />
                )}
              </CreateWaitSpot>
            )}
          </UpdateWaitSpot>
        </DialogBox>
      )}
    </>
  );
};

const mapStateToProps = ({ auth, entities }) => ({
  account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

export default memo(connect(mapStateToProps)(NextWaitlist));

NextWaitlist.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  account: PropTypes.instanceOf(Account).isRequired,
};

NextWaitlist.defaultProps = {
  waitlist: [],
};
