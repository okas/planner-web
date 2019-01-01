// Credit: https://medium.com/@disjfa/creating-navigation-using-vue-router-59d0b12ab75f

<template functional>
  <li class="menu-item">
    <RouterLink :to="props.item" :title="props.item.meta.alt || ''">{{props.item.meta.title}}</RouterLink>
    <ul class="menu-list" v-if="props.item.hasOwnProperty('children')">
      <MenuSideNode v-for="i in props.item.children" :item="i" :key="i.path"/>
    </ul>
  </li>
</template>

<script>
export default {
  props: { item: { type: Object, required: true } }
}
</script>
