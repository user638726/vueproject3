import axios from 'axios';

export default {
  registerCoach(context, data) {
    const { userId } = context.rootGetters;
    const coachData = {
      id: context.rootGetters.userId,
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    axios
      .put(
        `https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/coaches/${userId}.json`,
        coachData,
      )
      .then(() => {
        context.commit('registerCoach', { ...coachData, id: userId });
      })
      .catch(() => {
        // Handle error silently or add error handling logic here
      });
  },
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    try {
      const response = await axios.get(
        'https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/coaches.json',
      );
      const coaches = [];
      const responseData = response.data || response;
      Object.keys(responseData).forEach((key) => {
        const coach = {
          id: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          description: responseData[key].description,
          hourlyRate: responseData[key].hourlyRate,
          areas: responseData[key].areas,
        };
        coaches.push(coach);
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
