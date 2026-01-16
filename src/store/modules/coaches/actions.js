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
  async loadCoaches(context) {
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
  },
};
