import { makeAutoObservable } from 'mobx';
import { login, registration } from '../http/userAPI';

export default class UserStore {
  _isAuth = false;
  _user = {};

  constructor() {
    makeAutoObservable(this);
  }

  setIsAuth(bool) { // <-- Правильное название
    this._isAuth = bool;
  }

  setUser(user) { // <-- Правильное название
    this._user = user;
  }

  get isAuth() {
    return this._isAuth;
  }

  get user() {
    return this._user;
  }

  async login(email, password) {
    const userData = await login(email, password);
    this.setIsAuth(true); // <-- Правильное название
    this.setUser(userData); // <-- Правильное название
  }

  async registration(name, email, password, roleId = 1) {
    const userData = await registration(name, email, password, roleId);
    this.setIsAuth(true); // <-- Правильное название
    this.setUser(userData); // <-- Правильное название
  }
}
