<template functional>
  <div>
    <h5 class="title is-5 has-text-warning" v-text="props.headerText" />
    <p v-text="props.messageText"></p>
    <ul>
      <li v-for="dep of props.dependents" :key="dep.id">
        <router-link :to="{ name: 'dev-presets', hash: `#item${dep.id}` }">{{
          `${dep.name}`
        }}</router-link>
        <router-link
          class="inline-space-left"
          target="_blank"
          :to="{ name: 'dev-presets', hash: `#item${dep.id}` }"
        >
          <fa-i class="fa-xs" icon="external-link-alt" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    dependents: { type: Array, required: true },
    headerText: { type: String, required: true },
    messageText: { type: String, required: true }
  }
}
</script>

<style lang="scss" scoped>
.inline-space-left {
  margin-inline-start: 0.25rem;
}
</style>
