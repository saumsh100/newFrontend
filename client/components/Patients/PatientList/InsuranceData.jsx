import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import styles from './main.scss';

class InsuranceData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editData: true
    };
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickSave = this.handleClickSave.bind(this);
  }
  handleClickEdit() {
    console.log('double click handled');
    this.setState({
      editData: !this.state.editData
    })
  }
  handleClickSave(e) {
    console.log('save data handled');
    e.preventDefault();
    this.setState({
      editData: !this.state.editData
    })
  }
  render() {
    const { patient } = this.props;
    if (!patient) {
      return <div className={styles.loading}>Loading...</div>;
    }
    if (this.state.editData) {
      return (
        <div onDoubleClick={this.handleClickEdit} className={styles.right__personal}>
          <div className={styles.insurance}>
            <div className={styles.insurance__header}>
              <div className={`${styles.insurance__company} ${styles.insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-medkit" />
                </div>
                <div className={styles.insurance__value}>SunLife</div>
              </div>
              <div className={`${styles.insurance__id} ${styles.insurance__table}`}>
                <div className={styles.insurance__title}>MEMBER ID</div>
                <div className={styles.insurance__value}>123-456-78</div>
              </div>
              <div className={`${styles.insurance__contact} ${styles.insurance__table}`}>
                <div className={styles.insurance__title}>CONTRACT #</div>
                <div className={styles.insurance__value}>9101-11213</div>
              </div>
              <div className={`${styles.insurance__carrier} ${styles.insurance__table}`}>
                <div className={styles.insurance__title}>CARRIER #</div>
                <div className={styles.insurance__value}>16</div>
              </div>
            </div>
            <div className={styles.insurance__footer}>
              <div className={`${styles.insurance__sin} ${styles.insurance__table}`}>
                <div className={styles.icon}>
                  <i className="fa fa-id-card-o" />
                </div>
                <div className={styles.insurance__title}>SIN</div>
                <div className={styles.insurance__value}>123 456 789</div>
              </div>
            </div>
          </div>
        </div>
      );
      } else {
      return (
        <div className={styles.right__personal}>
          <div className={styles.edit_insurance}>
            <form>
              <div className={styles.edit_insurance__header}>
                <div className={`${styles.edit_insurance__company} ${styles.edit_insurance__table}`}>
                  <div className={styles.icon}>
                    <i className="fa fa-medkit" />
                  </div>
                  <input className={styles.edit_insurance__input} type="text" placeholder="Insurance" />
                </div>
                <div className={`${styles.edit_insurance__id} ${styles.edit_insurance__table}`}>
                  <input className={styles.edit_insurance__input} type="text" placeholder="Member ID #" />

                </div>
                <div className={`${styles.edit_insurance__contact} ${styles.edit_insurance__table}`}>
                  <input className={styles.edit_insurance__input} type="text" placeholder="Contract #" />

                </div>
                <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                  <input className={styles.edit_insurance__input} type="text" placeholder="Carrier #" />
                </div>
              </div>
              <div className={styles.edit_insurance__footer}>
                <div className={`${styles.edit_insurance__carrier} ${styles.edit_insurance__table}`}>
                  <div className={styles.icon}>
                    <i className="fa fa-id-card-o" />
                  </div>
                  <input className={styles.edit_insurance__input} type="text" placeholder="SIN #" />
                </div>
              </div>
              <input onClick={this.handleClickSave} className={styles.edit_insurance__btn} type="submit" value="Save" />
            </form>
          </div>
        </div>
      )
    }
  }
}

export default InsuranceData;
