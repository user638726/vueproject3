import axios from 'axios';

export default {
  registerCoach(context, data) {
    if (!context.rootGetters) {
      throw new Error('Store 未正確初始化');
    }

    const { userId, token } = context.rootGetters;

    if (!userId || !token) {
      throw new Error('使用者未登入，無法註冊為教練');
    }

    const coachData = {
      id: userId,
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    axios
      .put(
        `https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,
        coachData,
      )
      .then(() => {
        context.commit('registerCoach', { ...coachData, id: userId });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('註冊教練時發生錯誤:', error);
        throw error;
      });
  },
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    try {
      const token = context.rootGetters?.token;
      // If user is authenticated, include auth token; otherwise load publicly
      const url = token
        ? `https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/coaches.json?auth=${token}`
        : 'https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/coaches.json';
      const response = await axios.get(url);
      const coaches = [];
      const responseData = response.data || response;
      if (!responseData) {
        context.commit('setCoaches', coaches);
        context.commit('setFetchTimeStamp');
        return;
      }
      Object.keys(responseData).forEach((key) => {
        const coachData = responseData[key];
        if (coachData) {
          const coach = {
            id: key,
            firstName: coachData.firstName,
            lastName: coachData.lastName,
            description: coachData.description,
            hourlyRate: coachData.hourlyRate,
            areas: coachData.areas,
          };
          coaches.push(coach);
        }
      });
      context.commit('setCoaches', coaches);
      context.commit('setFetchTimeStamp');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('載入教練資料時發生錯誤:', error);
      // 可以選擇性地提交錯誤狀態到 store
      // context.commit('setError', error.message);
      throw error; // 重新拋出錯誤，讓調用者可以處理
    }
  },
};
