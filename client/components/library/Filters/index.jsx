import React, { PropTypes, Component } from 'react';
import { Card, Checkbox, Search, Form, Field } from '../../library';
import colorMap from '../../library/util/colorMap';
import styles from './styles.scss';

export default class Filters extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit() {

  }

  render() {
    const { filters } = this.props;
    return (
      <Card borderColor={colorMap.red} className={styles.card}>
        <Form form="filters" ignoreSaveButton>
          <div className={styles.filters}>
            <div className={styles.filters__header}>
              <div className={styles.filters__header__left}>
                <span>Filters</span>
                <span className="fa fa-sliders" />
              </div>
              <div className={styles.filters__header__right}>
                <span>Select All</span>
                <span>Clear All</span>
              </div>
            </div>
            <div className={styles.filters__search}>
              <span className="fa fa-search" />

              <Field
                required
                min
                name="firstName"
                laceholder="Search..."
                onChange={(event, newValue, previousValue) => {
                  console.log("newValue");
                  console.log(newValue);
                }}
              />
            </div>
            {filters.map(f => {
              let content =
              f.items.map(i => {
                return i.type === 'checkbox' ?
                  <div className={styles.filters__checkFilter__chbox}>
                    <span>{i.value}</span>
                    <span>
                      <Field 
                        component="Checkbox"
                        name={i.value}
                        type="checkbox"
                        input={{ onChange: (event, newValue, previousValue) => {
                          console.log("newValue");
                          console.log(newValue);
                        }}}
                        onChange={(e, newValue, previousValue) => {
                          console.log("newValue")
                          console.log(newValue)
                        }} 
                      />
                    
                    </span>
                  </div>
                  :
                  <div className={styles.filters__selectFilter}>
                    <select>
                      <option selected value={i.options[0]}>{i.options[0]}</option>
                        {i.options.map(item => (
                        <option value={item}>{item}</option>
                        ))} 
                    </select>
                  </div>
              })
              return (
                <div>
                  <div className={styles.filters__title}>
                    {f.titleIcon &&
                      <div style={{backgroundColor: f.titleIcon.color}} className={styles.filters__title__icon}>
                        <span className={`fa fa-${f.titleIcon.icon}`} />
                      </div> 
                    }
                    {f.title}
                  </div>
                  <div className={styles.filters__checkFilter}>
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
        </Form>
      </Card>
    );
  }
}
