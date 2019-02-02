// Credit:
https://medium.com/@disjfa/creating-navigation-using-vue-router-59d0b12ab75f

<template functional>
  <li class="menu-item">
    <RouterLink :to="props.item" :title="props.item.meta.alt || ''">{{
      props.item.meta.title
    }}</RouterLink>
    <ul v-if="props.item.hasOwnProperty('children')" class="menu-list">
      <MenuSideNode v-for="i in props.item.children" :key="i.path" :item="i" />
    </ul>
  </li>
</template>

<script>
export default {
  props: { item: { type: Object, required: true } }
}
</script>
