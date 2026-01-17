import axios from 'axios';

export default {
  async contactCoach(context, payload) {
    const newRequest = {
      userEmail: payload.email,
      message: payload.message,
    };
    try {
      const response = await axios.post(
        `https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${payload.coachId}.json`,
        newRequest,
      );
      // 從 Firebase 回應中獲取生成的 ID
      newRequest.id = response.data.name;
      newRequest.coachId = payload.coachId;
      context.commit('addRequest', newRequest);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('發送聯絡訊息時發生錯誤:', error);
      // 可以選擇性地提交錯誤狀態到 store
      // context.commit('setError', error.message);
      throw error; // 重新拋出錯誤，讓調用者可以處理
    }
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const { token } = context.rootGetters;
    try {
      const response = await axios.get(
        `https://vueproject3-18132-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`,
      );
      const requests = [];
      const responseData = response.data || response;
      if (!responseData) {
        context.commit('setRequests', requests);
        return;
      }
      Object.keys(responseData).forEach((key) => {
        const requestData = responseData[key];
        if (requestData) {
          const request = {
            id: key,
            coachId,
            userEmail: requestData.userEmail,
            message: requestData.message,
          };
          requests.push(request);
        }
      });
      context.commit('setRequests', requests);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('載入請求資料時發生錯誤:', error);
      // 可以選擇性地提交錯誤狀態到 store
      // context.commit('setError', error.message);
      throw error; // 重新拋出錯誤，讓調用者可以處理
    }
  },
};
