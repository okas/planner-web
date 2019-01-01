<template>
  <main id="http400" class>
    <div class="container has-text-centered">
      <h2 class="title is-3 is-spaced has-text-weight-semibold">HTTP 404</h2>
      <p class="notification is-warning">Siin aadresil ei ole midagi</p>
      <pre class="urls">
<span class>{{windowLocationOrigin}}</span><span
  class="is-size-5 has-text-weight-bold has-background-grey-lighter"
>{{$route.fullPath}}</span></pre>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      windowLocationOrigin: window.location.origin
    }
  }
}
</script>

<style lang="scss">
.urls {
  color: $special2;
}
</style>
