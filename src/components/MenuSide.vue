// Credit: https://medium.com/@disjfa/creating-navigation-using-vue-router-59d0b12ab75f

<template>
  <nav id="menu-side" class="menu" :class="{'has-background-warning': !hasRoutes}">
    <section class="menu-level1" v-for="r in filteredRoutes" :key="r.path">
      <h1 class="menu-label" v-text="r.meta.title"/>
      <ul class="menu-list" v-if="hasRoutes">
        <menu-side-node v-for="c in r.children" :item="c" :key="c.path"/>
      </ul>
      <p v-else v-text="message"/>
    </section>
  </nav>
</template>

<script>
import MenuSideNode from './MenuSideNode'
export default {
  props: { selectedPaths: { type: [String, Array], required: true } },
  components: { MenuSideNode },
  computed: {
    filteredRoutes() {
      return this.$router.options.routes.filter(
        r => r.hasOwnProperty('meta') && this.checkPath(r.path)
      )
    },
    hasRoutes() {
      return this.filteredRoutes.length > 0
    },
    message() {
      return this.hasRoutes
        ? ''
        : `Kriteerium(e) pole ruuteris: [${this.selectedPaths}]`
    }
  },
  methods: {
    checkPath(test) {
      return Array.isArray(this.selectedPaths)
        ? this.selectedPaths.some(s => s === test)
        : this.selectedPaths === test
    }
  }
}
</script>
