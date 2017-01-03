export  function openForm (patient) {
  return (dispatch) => {
    dispatch({ type: 'OPEN_PATIENT_FORM', patient });
  }
};

export const closeForm = () => (dispatch)=> dispatch({ type: 'CLOSE_PATIENT_FORM' });
