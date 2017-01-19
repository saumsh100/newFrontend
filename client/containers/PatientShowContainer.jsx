import React, {PropTypes, Component} from 'react';
import PatientShow from '../components/Patients/PatientShow';
import axios from 'axios';

class PatientShowContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {patient: null};
    }

    componentDidMount() {
        window.socket.on('receivePatient', (result) => {
            this.setState({patient: result});
        });
        window.socket.on('receivePatients', (result) => {
            this.setState({patients: result});
        });

        window.socket.emit('fetchPatient', {id: this.props.params.patientId});
        window.socket.emit('fetchPatients');
    }

    render() {
        const {patient, patients} = this.state;
        return (
            <div>
                <PatientShow patient={patient} patients={patients}/>
            </div>
        );
    }
}

PatientShowContainer.propTypes = {};

export default PatientShowContainer;
