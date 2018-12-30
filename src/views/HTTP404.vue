<template functional>
  <main id="http400" class="has-text-centered">
    <h2 class="title is-3 is-spaced has-text-weight-semibold">HTTP 404</h2>
    <p class="notification is-warning">Siin aadresil ei ole midagi</p>
    <pre><i>{{props.windowLocationOrigin}}</i><b>{{parent.$route.fullPath}}</b></pre>
  </main>
</template>

<script>
export default {
  props: {
    windowLocationOrigin: {
      default: window.location.origin
    }
  }
}
</script>
