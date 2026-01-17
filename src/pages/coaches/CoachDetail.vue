<template>
  <div v-if="isLoading">
    <base-spinner></base-spinner>
  </div>
  <div v-else-if="selectedCoach">
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </base-card>
    </section>
    <section>
      <base-card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>
    <section>
      <base-card>
        <base-badge v-for="area in areas" :key="area" :type="area" :title="area"></base-badge>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
  <div v-else>
    <section>
      <base-card>
        <h2>Coach not found</h2>
        <p>
          The coach you're looking for doesn't exist.
          <router-link to="/coaches">View all coaches</router-link>
        </p>
      </base-card>
    </section>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      selectedCoach: null,
      isLoading: true,
    };
  },
  computed: {
    fullName() {
      if (!this.selectedCoach) return '';
      return `${this.selectedCoach.firstName} ${this.selectedCoach.lastName}`;
    },
    areas() {
      return this.selectedCoach?.areas || [];
    },
    rate() {
      return this.selectedCoach?.hourlyRate || 0;
    },
    description() {
      return this.selectedCoach?.description || '';
    },
    contactLink() {
      return `/coaches/${this.id}/contact`;
    },
  },
  async created() {
    // 確保數據已加載
    const coaches = this.$store.getters['coaches/coaches'];
    if (!coaches || coaches.length === 0) {
      try {
        await this.$store.dispatch('coaches/loadCoaches', { forceRefresh: false });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load coaches:', error);
      }
    }

    // 查找教練
    this.selectedCoach = this.$store.getters['coaches/coaches'].find(
      (coach) => coach.id === this.id,
    );
    this.isLoading = false;
  },
};
</script>
