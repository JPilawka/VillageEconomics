<template>
  <div>
    <H2>Resources</h2>
    <div v-for="(r, index) in resources" :key="r.name">
      <h3>{{r.displayName}}</h3>
      <img :src="'@assets/images/resources/'+r.icon">
      <div>{{r.description}}</div>

    </div>
  </div>
</template>

<script>
import resources from '@/assets/resources.json'

export default{
  name: 'Resource',
  data(){
    return{
      resources: resources
    }
  }

}
</script>

<style>

</style>
