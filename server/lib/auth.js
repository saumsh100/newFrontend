
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import globals from '../config/globals';
import { User, Patient, AuthSession } from '../models';

export const error = (status, message) =>
  Promise.reject({ status, message });

const compare = (password, hash) => new Promise((fulfill, reject) => {
  bcrypt.compare(password, hash, (err, match) => {
    if (err) {
      return reject(err);
    }

    return fulfill(match);
  });
});

export const Auth = (Model, primaryKey) => ({
  /**
   * @param {string} key
   */
  load(key) {
    // TODO: change to the uniqueFetch helper
    return Model.filter({ [primaryKey]: key }).run()
      .then(([model]) => model);
  },

  /**
   * @param {string} key
   * @param {string} password
   */
  login(key, password) {
    return this.load(key)
      .then(model => (model || error(401, 'Invalid Credentials')))
      .then(model =>
        compare(password, model.password)
          .then(match => (match ?
              model :
              error(401, 'Invalid Credentials')
          ))
          // TODO: remove AuthSession creation from here ?
          .then(() => AuthSession.save({ modelId: model.id }))
          .then(session => ({ session, model }))
      );
  },

  /**
   * @param {object} model
   */
  signup(model) {
    model[primaryKey] = model[primaryKey].toLowerCase();
    model.password = bcrypt.hashSync(model.password, globals.passwordHashSaltRounds);

    return this.load(model[primaryKey])
      .then(existedModel => (!existedModel) || error(400, 'Email Already in Use'))
      .then(() => Model.save(model))
      .then(savedModel =>
        AuthSession.save({ modelId: savedModel.id })
          .then(authSession => ({ savedModel, authSession }))
      );
  },

  /**
   * @param {string} token
   */
  logout(sessionId) {
    return AuthSession.get(sessionId).then(authSession => authSession.delete());
  },

  /**
   * @param {object} tokenData
   */
  signToken(tokenData) {
    return new Promise((fulfill, reject) => {
      // TODO: This needs to be slowly phased out as we move towards session storage
      jwt.sign(tokenData, globals.tokenSecret, { expiresIn: globals.tokenExpiry }, (err, token) =>
        (err ? reject(err) : fulfill(token))
      );
    });
  },

  updateSession(sessionId, session, updates) {
    // TODO: does this need to be a delete then save new?
    return AuthSession.get(sessionId).then(
      prevSession => prevSession.delete()
    ).then(
      () => AuthSession.save({ ...session, ...updates, modelId: session.userId })
    );
  },
});

export const UserAuth = Auth(User, 'username');
export const PatientAuth = Auth(Patient, 'email');
