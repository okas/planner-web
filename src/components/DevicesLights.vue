<template>
  <main id="ligths" class="column container">
    <section>
      <h1 class="title is-2 is-spaced has-text-weight-semibold" v-text="appTitle()"/>
      <article>Siia tuleb tulede list, et lülitada neid tööle.</article>
    </section>
  </main>
</template>

<script>
export default {
  name: 'DevicesLights',
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
