<template>
  <section id="ligths" class="column container">
    <h1 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle()"/>
    <article>Siia tuleb tulede list, et lülitada neid tööle.</article>
  </section>
</template>

<script>
export default {
  methods: {
    appTitle() {
      return 'Tuled'
    }
  }
}
</script>

<style lang="scss" scoped>
#ligths {
  border: 1px blueviolet solid;
}
</style>
