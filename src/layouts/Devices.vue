<template>
  <main>
    <div class="container">
      <div class="columns">
        <aside class="column is-narrow">
          <MenuSide :selected-paths="path"/>
        </aside>
        <RouterView class="column is-offset-1"/>
      </div>
    </div>
  </main>
</template>

<script>
import MenuSide from '../components/MenuSide.vue'
export default {
  components: { MenuSide },
  data() {
    return { path: '/devices' }
  },
  components: { MenuSide }
}
</script>
