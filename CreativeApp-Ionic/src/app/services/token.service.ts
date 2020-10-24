import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private storage: Storage) { }
  setToken(token) {
    this.storage.set('creative_token', token);
  }
  getToken() {
    return this.storage.get('creative_token');
  }
  deleteToken() {
    this.storage.remove('creative_token');
  }
  async getPayload() {
    const token = await this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = JSON.parse(atob(payload));
    }
    return payload.data;
  }
}
