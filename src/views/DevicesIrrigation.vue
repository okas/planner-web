<template>
  <section id="irrigation">
    <header>
      <slot name="header-title" :cls="'has-text-info'"/>
      <p class="has-text-info">Kastmise süsteemi armatuurlaud</p>
    </header>
  </section>
</template>

<script>
export default {
  name: 'Irrigation'
}
</script>
