import axios from 'axios';

export default {
  async login(context, payload) {
    try {
      const response = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSooMpbBO_PrzSD_nddN1ageHe8QUVmZg',
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        },
      );
      const responseData = response.data;
      // TODO: Commit mutation with user data if needed
      console.log(responseData);
      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('註冊時發生錯誤:', error);
      throw error;
    }
  },
  async signup(context, payload) {
    try {
      const response = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSooMpbBO_PrzSD_nddN1ageHe8QUVmZg',
        {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        },
      );
      const responseData = response.data;
      // TODO: Commit mutation with user data if needed
      // context.commit('setUser', responseData);
      console.log(responseData);
      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('註冊時發生錯誤:', error);
      throw error;
    }
  },
};
