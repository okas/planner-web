<template>
  <div class="columns is-vcentered">
    <aside class="column container">
      <menu-side :selectedPaths="path"/>
    </aside>
    <router-view/>
  </div>
</template>

<script>
import MenuSide from '../components/MenuSide.vue'
export default {
  data() {
    return { path: '/devices' }
  },
  components: { MenuSide }
}
</script>
