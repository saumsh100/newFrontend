
export const UniqueFieldError = (Model, fieldName) =>
  new Error(
    'Unique Field Validation Error in ' +
    `${Model.tableName} model with [${fieldName}] field`
  );
