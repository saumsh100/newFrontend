
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownMenu, MenuItem } from '../../library/DropdownMenu';
import ChatMenuLabel from './ChatMenuLabel';
import styles from './styles.scss';

const chatOptions = ['Open', 'Closed', 'Unread', 'Flagged', 'All'];

function ChatMenu({ changeTab, index, chatCategoriesCount }) {
  const count = (key) => {
    key = key.toLowerCase();
    return chatCategoriesCount[key] ? `(${chatCategoriesCount[key]})` : null;
  };
  return (
    <div className={styles.chatMenuWrapper}>
      <DropdownMenu
        upwards
        labelComponent={props =>
          index !== null && <ChatMenuLabel {...props} label={chatOptions[index]} count={count} />
        }
      >
        {chatOptions.map((option, i) => (
          <MenuItem key={option} onClick={() => changeTab(i)}>
            {option} {count(option)}
          </MenuItem>
        ))}
      </DropdownMenu>
    </div>
  );
}

ChatMenu.propTypes = {
  changeTab: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  chatCategoriesCount: PropTypes.shape({
    flagged: PropTypes.number.isRequired,
    open: PropTypes.number.isRequired,
    closed: PropTypes.number.isRequired,
    unread: PropTypes.number.isRequired,
  }).isRequired,
};

function mapStateToProps({ chat }) {
  const chatCategoriesCount = chat.get('chatCategoriesCount');

  return {
    chatCategoriesCount,
  };
}

const enhance = connect(
  mapStateToProps,
  () => {},
);

export default enhance(ChatMenu);
