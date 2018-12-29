// Credit: https://medium.com/@disjfa/creating-navigation-using-vue-router-59d0b12ab75f

<template>
  <nav id="menu-side" class="menu">
    <section class="menu-level1" v-for="r in foundRoutes" :key="r.path">
      <h1 class="menu-label" v-text="r.meta.title"/>
      <ul class="menu-list">
        <menu-side-node v-for="c in r.children" :item="c" :key="c.path"/>
      </ul>
    </section>
    <section class="notification is-paddingless is-warning" v-if="!foundRoutes.length">
      <h1 class="menu-label" v-text="message"/>
      <ul class="menu-list">
        <li v-for="s in paths" :key="s" v-text="s"/>
      </ul>
    </section>
  </nav>
</template>

<script>
import MenuSideNode from './MenuSideNode.vue'
export default {
  data() {
    return { message: 'Ruuteris puuduvad teekonnad:' }
  },
  props: { selectedPaths: { type: [String, Array], required: true } },
  components: { MenuSideNode },
  computed: {
    foundRoutes() {
      return this.$router.options.routes.filter(
        r =>
          r.hasOwnProperty('meta') &&
          this.paths.some(p => r.path.toLowerCase() == p.toLowerCase())
      )
    },
    paths() {
      return Array.isArray(this.selectedPaths)
        ? this.selectedPaths
        : [this.selectedPaths]
    }
  }
}
</script>
