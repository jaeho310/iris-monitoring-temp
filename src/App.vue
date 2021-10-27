<template>
  <layout-index />
</template>

<script>
  import '@/style/overrides.sass'
export default {
  name: 'App',
  components: {
    LayoutIndex: () => import(
        '@/layouts/LayoutIndex'
    ),
  }
};
</script>

<style lang="css">
  tbody tr:nth-of-type(odd) {
    background-color: #ffffff;
  }
  tbody tr:nth-of-type(even) {
    background-color: #f9f9f9;
  }
  th {
    background-color: #f2f5f8 !important;
    color: black !important;
  }
  html {
    overflow-y: auto !important;
  }
</style>