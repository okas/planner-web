<template>
  <main id="home" class="has-text-centered">
    <div class="container">
      <h1 class="title">Tere ;)</h1>
      <section class="p-grid">
        <div class="p-head box is-marginless">Päis</div>
        <div class="p-container">
          <div class="p-aside box is-marginless">Külg</div>
          <div class="p-main box is-marginless">Sisu</div>
        </div>
        <div class="p-footer box is-marginless">Jalus</div>
      </section>
    </div>
  </main>
</template>

<script>
export default {}
</script>

<style lang="scss">
.p-grid {
  max-height: 400px;
  max-width: 400px;
  display: grid;
  grid-gap: 7px;
  grid-template-rows: 40px 200px 40px;
  grid-template-areas:
    'h'
    'x'
    'f';
  .p-head {
    grid-area: h;
  }
  .p-container {
    grid-area: x;
    grid-gap: 5px;
    display: grid;
    grid-template-columns: 75px auto;
    grid-template-areas: 'a m';
    .p-aside {
      grid-area: a;
    }
    .p-main {
      grid-area: m;
    }
  }
  .p-footer {
    grid-area: f;
  }
}
</style>
