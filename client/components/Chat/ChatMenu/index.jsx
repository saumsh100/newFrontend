
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownMenu, MenuItem } from '../../library/DropdownMenu';
import ChatMenuLabel from './ChatMenuLabel';
import styles from './styles.scss';

const chatOptions = ['Open', 'Closed', 'Unread', 'Flagged', 'All'];

function ChatMenu({ changeTab, index, chatCategoriesCount }) {
  const count = key => (chatCategoriesCount[key] ? `(${chatCategoriesCount[key]})` : null);
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
            {option} {count(option.toLowerCase())}
          </MenuItem>
        ))}
      </DropdownMenu>
    </div>
  );
}

ChatMenu.propTypes = {
  changeTab: PropTypes.func.isRequired,
  chatCategoriesCount: PropTypes.shape({
    flagged: PropTypes.number,
    open: PropTypes.number,
    unread: PropTypes.number,
  }),
  index: PropTypes.number,
};

ChatMenu.defaultProps = {
  chatCategoriesCount: {
    flagged: 0,
    open: 0,
    unread: 0,
  },
  index: 0,
};

const mapStateToProps = ({ chat }) => ({
  chatCategoriesCount: chat.get('chatCategoriesCount'),
});

export default connect(mapStateToProps)(ChatMenu);
