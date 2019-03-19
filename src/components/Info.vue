<template>
  <div>
    <H2>Informations</h2>
    <div class="tip">
      <hr class="p-1 m-auto w-25">
      <div class="part">
        <h4>Points</h4>
         <b>You earn points from:</b>
           <p>Selling items (value in coins is added to points)</p>
           <p>Production value in village buildings and from field buildings</p>
           <p>For each new worker</p>
         <b>You can also loose points when you loose workers</b>
      </div>

       <hr class="p-1 m-auto w-25">
       <div class="part">
         <h4>Production</h4>
         <p>Production occurs only when buildings or fields are staffed with workers and "active".
           You can deactivate buildings.</p>
       </div>

       <hr class="p-1 m-auto w-25">
       <div class="part">
         <h4>Food and workers</h4>
         <p>Each turn you ned to feed your workers. For each worker you need two units of food.</p>
         <p>It's good idea to build food generating buildings first
         (there are already Windmill and Bakery at the start in your village).</p>
         <p>If you have more food than twice as many as max workers you'll be granted additional workers</p>
         <p>If you don't have enough food your workers will be dying (as many as there's lack of food)</p>
       </div>

       <hr class="p-1 m-auto w-25">
    </div>
  </div>

</template>

<script>
export default {
  name: "Info"
}

</script>

<style scoped>
ul{
  list-style: armenian;
}
h4{
  font-weight: bold;
}
ol{
  margin: 15px;
}
.part{
  margin: 10px;
}
p::first-letter{
  font-weight: bold;
  font-size: 110%;
}
p{
  margin: 5px;
}

b{
  margin: 10px;
}
</style>
