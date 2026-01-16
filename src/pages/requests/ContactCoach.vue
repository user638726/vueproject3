<template>
<div></div>
</template>

<script>
export default {
  computed: {
    selectedCoach() {
      return this.$store.getters['coaches/coach'](this.$route.params.id);
    },
  },
};
</script>
