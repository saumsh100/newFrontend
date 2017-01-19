import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import {fetchEntities} from '../../../thunks/fetchEntities';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class MonthView extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="schedule">
                <div className="schedule__title title">
                    <div className="title__side">
                        <div className="title__month">Wednesday</div>
                        <div className="title__day">FEBRUARY</div>
                    </div>
                    <div className="title__number">15</div>
                </div>
                Monthly schedule
            </div>
        );
    }
}

export default MonthView;
