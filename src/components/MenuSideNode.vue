// Credit: https://medium.com/@disjfa/creating-navigation-using-vue-router-59d0b12ab75f

<template functional>
  <li>
    <router-link :to="props.item" :title="props.item.meta.alt || ''">{{props.item.meta.title}}</router-link>
    <ul class="menu-list" v-if="props.item.hasOwnProperty('children')">
      <!-- eslint-disable-next-line -->
      <menu-side-node v-for="i in props.item.children" :item="i"/>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'MenuSideNode',
  props: { item: { type: Object, required: true } }
}
</script>
