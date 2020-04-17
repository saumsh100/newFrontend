
import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import { connect } from 'react-redux';
import WaitlistTableWithActions from './WaitlistTableWithActions';
import Account from '../../../../entities/models/Account';
import { batchUpdateFactory, mergeData } from './helpers';
import DraftMessage from './WaitlistMessage/DraftMessage';
import ResponseMessage from './WaitlistMessage/ResponseMessage';
import {
  loadMassTextTemplate,
  sendMassMessage,
  waitlistRecipientsAnalyzer,
} from '../../../../thunks/waitlist';

export const WAITLIST_STATE = {
  initial: 0,
  draft: 1,
  sent: 2,
};

const NextWaitlist = ({ toggleWaitlist, account, ...props }) => {
  const batchUpdate = useCallback((state = false) => batchUpdateFactory(props.waitlist)(state), [
    props.waitlist,
  ]);
  const [selectedWaitlistMap, setSelectedWaitlistIds] = useState(batchUpdate);
  const [waitlistState, setWaitListState] = useState(WAITLIST_STATE.initial);
  const [textMessage, setTextMessage] = useState('');
  const [conversionAnalyzer, setConversionAnalyzer] = useState({ success: [],
    errors: [] });
  const [sentMessages, setSentMessages] = useState({ success: [],
    errors: [] });

  useEffect(() => {
    setSelectedWaitlistIds(batchUpdate());
  }, [batchUpdate]);

  useEffect(() => {
    loadMassTextTemplate(account.toJS()).then(({ data }) => setTextMessage(data));
  }, [account, sentMessages]);

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
    const dataset = groupBy([...conversionAnalyzer.success, ...conversionAnalyzer.errors], 'id');
    sendMassMessage(account.get('id'), Object.keys(dataset), textMessage).then(({ data }) => {
      const sentData = {
        errors: mergeData(data.errors, dataset),
        success: mergeData(data.success, dataset),
      };

      setSentMessages(sentData);
      setWaitListState(WAITLIST_STATE.sent);
    });
  }, [account, conversionAnalyzer, textMessage]);
  switch (waitlistState) {
    default:
    case WAITLIST_STATE.initial:
      return (
        <WaitlistTableWithActions
          {...props}
          batchUpdate={batchUpdate}
          goToSendMassMessage={goToSendMassMessage}
          setSelectedWaitlistIds={setSelectedWaitlistIds}
          selectedWaitlistMap={selectedWaitlistMap}
        />
      );

    case WAITLIST_STATE.draft:
      return (
        <DraftMessage
          {...props}
          conversionAnalyzer={conversionAnalyzer}
          goToWaitlistTable={() => setWaitListState(WAITLIST_STATE.initial)}
          handleSendMessage={handleSendMessage}
          toggleWaitlist={toggleWaitlist}
          textMessage={textMessage}
          selectedWaitlistMap={selectedWaitlistMap}
          setTextMessage={setTextMessage}
        />
      );

    case WAITLIST_STATE.sent:
      return (
        <ResponseMessage
          {...props}
          sentMessages={sentMessages}
          toggleWaitlist={toggleWaitlist}
          goToWaitlistTable={() => setWaitListState(WAITLIST_STATE.initial)}
          textMessage={textMessage}
          selectedWaitlistMap={selectedWaitlistMap}
        />
      );
  }
};

const mapStateToProps = ({ auth, entities }) => ({
  account: entities.getIn(['accounts', 'models', auth.get('accountId')]),
});

export default memo(connect(mapStateToProps)(NextWaitlist));

NextWaitlist.propTypes = {
  waitlist: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  account: PropTypes.instanceOf(Account).isRequired,
  toggleWaitlist: PropTypes.func.isRequired,
};

NextWaitlist.defaultProps = {
  waitlist: [],
};
