import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import { useSelector } from 'react-redux';
import DialogBox from '../../../library/DialogBox';
import WaitlistTableWithActions from './WaitlistTableWithActions';
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
import { sortPractitionersAlphabetical } from '../../../Utils';
import styles from '../styles.scss';

export const WAITLIST_STATE = {
  initial: 0,
  draft: 1,
  sent: 2,
  form: 3,
};

const NextWaitlist = (props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { account, practitioners } = useCallback(
    useSelector(({ auth, entities }) => ({
      account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
      practitioners: entities
        .getIn(['practitioners', 'models'])
        .sort(sortPractitionersAlphabetical)
        .toArray()
        .filter((practitioner) => practitioner.isActive)
        .map((practitioner) => ({
          value: practitioner.get('id'),
          label: practitioner.getPrettyName(),
        })),
    })),
    [],
  );
  const batchUpdate = useCallback(
    (state = false, waitListIDs) => batchUpdateFactory(props.waitlist)(state, waitListIDs),
    [props.waitlist],
  );

  const { timezone, id: accountId, name, unit } = account.toJS();

  const [selectedWaitSpot, setSelectedWaitSpot] = useState({});
  const isNewWaitSpot = Object.keys(selectedWaitSpot).length === 0;
  const [selectedWaitlistMap, setSelectedWaitlistMap] = useState(batchUpdate);
  const [waitlistState, setWaitListState] = useState(WAITLIST_STATE.initial);
  const [textMessage, setTextMessage] = useState('');
  const [conversionAnalyzer, setConversionAnalyzer] = useState({ success: [], errors: [] });
  const [sentMessages, setSentMessages] = useState({ success: [], errors: [] });

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    setSelectedWaitlistMap(batchUpdate());
  }, [batchUpdate]);

  const loadDefaultTemplate = useCallback(() => {
    loadMassTextTemplate({ timezone, id: accountId, name }).then(({ data }) => {
      setTextMessage((prevTextMessage) => {
        if (prevTextMessage !== data) {
          return data;
        }
        return prevTextMessage;
      });
    });
  }, [accountId, name, timezone]);

  useEffect(() => {
    loadDefaultTemplate();
  }, [timezone, name, accountId, loadDefaultTemplate]);

  const goToSendMassMessage = useCallback(
    (ids) => {
      waitlistRecipientsAnalyzer(accountId, ids).then(({ data }) => {
        setConversionAnalyzer(data);
        setWaitListState(WAITLIST_STATE.draft);
      });
    },
    [accountId],
  );

  const handleSendMessage = useCallback(() => {
    setIsSendingMessage(true);
    const dataset = groupBy([...conversionAnalyzer.success, ...conversionAnalyzer.errors], 'id');
    sendMassMessage(accountId, Object.keys(dataset), textMessage).then(({ data }) => {
      const sentData = {
        errors: mergeData(data.errors, dataset),
        success: mergeData(data.success, dataset),
      };

      setSentMessages(sentData);
      setIsSendingMessage(false);
      setWaitListState(WAITLIST_STATE.sent);
    });
  }, [accountId, conversionAnalyzer, textMessage]);

  const handleSubmit =
    (callback) =>
    ({ patient, patientUser, ...values }) => {
      callback({
        variables: {
          input: {
            ...values,
            accountId,
            patientId: patient && patient.id,
            patientUserId: patientUser && patientUser.id,
            id: selectedWaitSpot.id,
          },
        },
      });

      resetEditForm();
    };

  const handleEdit = useCallback(
    (waitspotId) => () => {
      const waitSpot = props.waitlist.find(({ ccId }) => ccId === waitspotId);
      setSelectedWaitSpot(waitSpot);
      setWaitListState(WAITLIST_STATE.form);
    },
    [props.waitlist],
  );

  const resetEditForm = () => {
    setSelectedWaitSpot({});
    setWaitListState(WAITLIST_STATE.initial);
  };

  const goToAddWaitListForm = useCallback(() => setWaitListState(WAITLIST_STATE.form), []);
  const setWaitListToInitialState = useCallback(() => setWaitListState(WAITLIST_STATE.initial), []);

  return (
    <>
      <WaitlistTableWithActions
        {...props}
        practitioners={practitioners}
        batchUpdate={batchUpdate}
        onEdit={handleEdit}
        goToAddWaitListForm={goToAddWaitListForm}
        goToSendMassMessage={goToSendMassMessage}
        setSelectedWaitlistMap={setSelectedWaitlistMap}
        selectedWaitlistMap={selectedWaitlistMap}
      />
      <DialogBox
        title="Waitlist"
        active={waitlistState === WAITLIST_STATE.draft}
        bodyStyles={styles.dialogBodyList}
        onEscKeyDown={setWaitListToInitialState}
        onOverlayClick={setWaitListToInitialState}
        type="large"
      >
        <DraftMessage
          {...props}
          conversionAnalyzer={conversionAnalyzer}
          goToWaitlistTable={setWaitListToInitialState}
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
        onEscKeyDown={setWaitListToInitialState}
        onOverlayClick={setWaitListToInitialState}
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
          onEscKeyDown={resetEditForm}
          onOverlayClick={resetEditForm}
          type="large"
        >
          <UpdateWaitSpot>
            {(updateWaitSpotHandler) => (
              <CreateWaitSpot>
                {(createWaitSpotHandler) => (
                  <WaitlistForm
                    waitlist={props.waitlist}
                    isNewWaitSpot={isNewWaitSpot}
                    timezone={timezone}
                    initialState={selectedWaitSpot}
                    handleSubmit={handleSubmit(
                      isNewWaitSpot ? createWaitSpotHandler : updateWaitSpotHandler,
                    )}
                    goToWaitlistTable={resetEditForm}
                    defaultUnit={unit}
                    practitioners={practitioners}
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

export default memo(NextWaitlist);

NextWaitlist.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

NextWaitlist.defaultProps = {
  waitlist: [],
};
