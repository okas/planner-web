<template>
  <section id="windowlinds">
    <h1 class="title is-1 has-text-success">Ruloode juhtimine</h1>
    <p class="has-text-success">Roloode süsteemi armatuurlaud</p>
    <section class="room has-text-centered">
      <h3 class="title is-4">Mom&amp;Dad's room</h3>
      <remote class/>
    </section>
  </section>
</template>

<script>
import Remote from './DevicesWindowBlindsRemote'
export default {
  components: { Remote }
}
</script>
