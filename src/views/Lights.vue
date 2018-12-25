<template>
  <section>
    <header>
      <h1 v-text="appTitle()"/>
    </header>
    <p>Siia tuleb tulede list, et lülitada neid tööle.</p>
  </section>
</template>

<script>
export default {
  name: 'lights',
  head: { title: { inner: 'Tuled' } },
  methods: {
    appTitle() {
      return 'Tuled'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
