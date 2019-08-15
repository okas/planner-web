// Credit:
https://medium.com/@disjfa/creating-navigation-using-vue-router-59d0b12ab75f

<template>
  <nav id="menu-side" class="menu">
    <section v-for="r in foundRoutes" :key="r.path" class="menu-level1">
      <h1 class="menu-label" v-text="r.meta.title" />
      <ul class="menu-list">
        <MenuSideNode v-for="c in r.children" :key="c.path" :item="c" />
      </ul>
    </section>
    <section
      v-if="!foundRoutes.length"
      class="notification is-paddingless is-danger"
    >
      <h3 class="menu-label has-text-weight-semibold" v-text="errTitle" />
      <ul class="menu-list">
        <li class="menu-item" v-text="errMessage" />
        <li v-for="s in paths" :key="s" class="menu-item" v-text="s" />
      </ul>
    </section>
  </nav>
</template>

<script>
import MenuSideNode from './MenuSideNode.vue'
export default {
  components: { MenuSideNode },
  props: { selectedPaths: { type: [String, Array], required: true } },
  data() {
    return {
      errTitle: 'Viga menüü loomisel!',
      errMessage: 'Ruuteri pole teekondi:'
    }
  },
  computed: {
    foundRoutes() {
      return this.$router.options.routes.filter(
        r =>
          Object.prototype.hasOwnProperty.call(r, 'meta') &&
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
