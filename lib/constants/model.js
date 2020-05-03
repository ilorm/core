/*
  Constant used in a model context
 */

module.exports = {
  // Boolean to know if the model instance is new (never saved in the database) or not new
  // (already save in the database).
  // Change this value, change the behavior of the save and remove method of the Model.
  IS_NEW: Symbol('isNew'),

  // List of every element of the current instance which have been updated during the life of the object
  // Change the behavior of a save during an update process
  LIST_UPDATED_FIELDS: Symbol('listUpdatedFields'),

  // Current schema binded with the model
  SCHEMA: Symbol('schema'),
};

