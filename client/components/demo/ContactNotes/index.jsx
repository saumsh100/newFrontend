
import PropTypes from 'prop-types';
import React from 'react';
import map from 'lodash/map';
import { Toggle } from '../../library';
import convertToCommsPreferences from '../../../../server/util/convertToCommsPreferences';
import styles from './styles.scss';

function HighlightPreferences({ preferences }) {
  return (
    <div className={styles.prefsWrapper}>
      {map(preferences, (val, key) => (
        <Toggle key={`${key}_toggle`} checked={val} label={key} />
      ))}
    </div>
  );
}

class ContactNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: null,
      prefs: {
        sms: true,
        emailNotifications: true,
        phone: true,
      },
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const notes = e.target.value;
    this.setState({
      notes,
      prefs: convertToCommsPreferences(notes),
    });
  }

  render() {
    return (
      <div className={styles.contactMethodWrapper}>
        <h3>Contact Method Note</h3>
        <textarea onChange={this.onChange}>{this.state.notes}</textarea>
        <h3>Patient Preferences</h3>
        <HighlightPreferences preferences={this.state.prefs} />
      </div>
    );
  }
}

ContactNotes.propTypes = {};

export default ContactNotes;
