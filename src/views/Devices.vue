<template>
  <main class="columns is-vcentered">
      <menu-side :selectedPaths="path"/>
    </aside>
  </main>
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
