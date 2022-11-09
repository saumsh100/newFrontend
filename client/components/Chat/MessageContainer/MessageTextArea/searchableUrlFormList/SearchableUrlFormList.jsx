import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../../../library';
import styles from './searchableUrlFomList.scss';

function SearchableUrlFormList({ placeholder, addFormUrl, formListData, loading }) {
  const [value, setValue] = useState('');
  const [formUrlOptions, setFormUrlOptions] = useState([]);

  useEffect(() => {
    setFormUrlOptions(formListData);
  }, [formListData]);

  const handleChange = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);
    const formUrlOptionsArr = searchValue
      ? formListData.filter((option) => {
          return option?.name?.toLowerCase().includes(searchValue?.toLowerCase());
        })
      : formListData;
    setFormUrlOptions(formUrlOptionsArr);
  };
  return (
    <div className={styles.chatFormUrl__container}>
      <div className={styles.chatFormUrl__inputContainer}>
        <Icon className={styles.chatFormUrl__searchIcon} icon="search" />
        <input
          className={styles.chatFormUrl__searchField}
          type="text"
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      </div>
      <div className={styles.chatFormUrl__optionsContainer}>
        {loading && !formUrlOptions.length ? (
          <div className={styles.chatFormUrl__loading}>Loading...</div>
        ) : null}
        {!loading && formUrlOptions?.length ? (
          <div className={styles.chatFormUrl__options}>
            {formUrlOptions.map((option) => (
              <>
                <div
                  role="button"
                  tabIndex="0"
                  className={styles.chatFormUrl__option}
                  onClick={() => addFormUrl(option)}
                  key={option.key}
                  onKeyDown={() => addFormUrl(option)}
                >
                  <Icon icon="file-alt" />
                  {option?.name}
                </div>
              </>
            ))}
          </div>
        ) : (
          <div className={styles.chatFormUrl__loading}>Not Found.</div>
        )}
      </div>
    </div>
  );
}

SearchableUrlFormList.propTypes = {
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  addFormUrl: PropTypes.func.isRequired,
  formListData: PropTypes.arrayOf(PropTypes.string),
};

SearchableUrlFormList.defaultProps = {
  placeholder: '',
  loading: false,
  formListData: [],
};

export default SearchableUrlFormList;
