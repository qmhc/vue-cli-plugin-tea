<template>
  <section>
    <header></header>
    <main>
      <%_ if (useRouter) { _%>
      <transition name="<%- useVexip ? 'vxp-' : '' %>fade" mode="out-in">
        <router-view></router-view>
      </transition>
      <%_ } else { _%>
      <Example></Example>
      <%_ } _%>
    </main>
    <footer></footer>
  </section>
</template>

<script>
<%_ if (!useRouter) { _%>
import Example from './components/example'

export default {
  name: 'App',
  components: {
    Example
  }
}
<%_ } else { _%>
export default {
  name: 'App'
}
<%_ } _%>
</script>
<%_ if (useRouter && !useVexip) { _%>

  <%_ if (useSass) { _%>
<style lang="scss">
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 300ms ease;
  }

  &-enter,
  &-leave-to,
  &-leave-active {
    opacity: 0;
  }
}
  <%_ } else { _%>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter,
.fade-leave-to
.fade-leave-active {
  opacity: 0;
}
  <%_ } _%>
</style>
<%_ } _%>
