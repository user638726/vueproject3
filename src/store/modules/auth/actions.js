import axios from 'axios';

let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup',
    });
  },
  async auth(context, payload) {
    const { mode } = payload;
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSooMpbBO_PrzSD_nddN1ageHe8QUVmZg';
    if (mode === 'signup') {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSooMpbBO_PrzSD_nddN1ageHe8QUVmZg';
    }
    try {
      const response = await axios.post(url, {
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      });
      const responseData = response.data;
      const expiresIn = +responseData.expiresIn * 1000;
      // const expiresIn = 5000;
      const expirationDate = new Date().getTime() + expiresIn;
      // TODO: Commit mutation with user data if needed
      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);
      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);
      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('註冊時發生錯誤:', error);
      throw error;
    }
  },
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      return;
    }
    timer = setTimeout(() => {
      context.dispatch('autoLogout');
    }, expiresIn);

    if (token && userId) {
      context.commit('setUser', {
        token,
        userId,
      });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
    clearTimeout(timer);
    context.commit('setUser', {
      token: null,
      userId: null,
    });
  },
  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  },
};
