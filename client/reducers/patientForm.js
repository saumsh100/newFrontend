const initialState = {
  opened:false,
  patient: null
};

export default (state = initialState, action) =>{
  switch(action.type){
    case 'OPEN_PATIENT_FORM':
      return Object.assign({}, state, { patient: action.patient, opened: true });
    case 'CLOSE_PATIENT_FORM':
      return Object.assign({}, state, { opened:false });
    default:
      return state;
  }
}
