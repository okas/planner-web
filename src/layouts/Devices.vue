<template>
  <main>
    <div class="devices container">
      <div class="columns">
        <aside class="column is-narrow">
          <MenuSide :selected-paths="path" />
        </aside>
        <RouterView class="column is-offset-1">
          <h1
            slot="header-title"
            slot-scope="{ _class }"
            class="title is-1"
            :class="_class"
            v-text="headerTitle"
          />
        </RouterView>
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
  computed: {
    headerTitle() {
      return this.$route.meta.title
    }
  }
}
</script>
