import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import globals from '../config/globals';
import { User, Patient, AuthToken } from '../models';

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
          .then(() => AuthToken.save({ modelId: model.id }))
          .then(token => ({ token, model }))
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
        AuthToken.save({ modelId: savedModel.id })
          .then(token => ({ savedModel, token }))
      );
  },

  /**
   * @param {string} token
   */
  logout(token) {
    return AuthToken.get(token).then(authToken => authToken.delete());
  },

  /**
   * @param {object} tokenData
   */
  signToken(tokenData) {
    return new Promise((fulfill, reject) => {
      jwt.sign(tokenData, globals.tokenSecret, { expiresIn: globals.tokenExpiry }, (err, token) =>
        (err ? reject(err) : fulfill(token))
      );
    });
  },
});

export const UserAuth = Auth(User, 'username');
export const PatientAuth = Auth(Patient, 'email');
