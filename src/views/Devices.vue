<template>
  <div class="columns is-vcentered">
    <main id="ligths" class="column container">
  <section>
    <header>
      <h1 v-text="appTitle()"/>
    </header>
    <p>Siia tuleb tulede list, et lülitada neid tööle.</p>
  </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Lights',
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
