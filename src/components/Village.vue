<template>
  <div>
    <H2>Buildings</h2>


      <div class="card p-2 m-3">
        <div v-for="(b, index) in buildings" class="bd-light border m-1 p-1">
          <div class="row">
            <div class="col-3">
              <img :style="{backgroundImage: 'url('+require('@/assets/images/buildings/'+b.name+'.png')+')'}" class="mt-2 res">
            </div>
            <div class="d-flex justify-content-between">
              <span class="name mt-2"><h5>{{b.name}}</h5></span>
            </div>
            <div class="col-6">

              <div class="d-inline-flex">
                <div class="d-inline-flex justify-content-around">
                  <div class="infoSqr">
                    Workers:<br/>
                    <button class="btn btn-add m-1" @click="decreaseWorkers(index)">-</button>
                    <span>{{b.workers_active}} / {{b.workers_needed}}</span>
                    <button class="btn btn-add m-1" @click="increaseWorkers(index)">+</button>

                  </div>
                  <div class="infoSqr col-4">
                    <button v-if="b.isActive" class="btn btn-danger" @click="changeActive(index)">Deactivate</button>
                    <button v-if="!b.isActive && b.workers_active>0" class="btn btn-success" @click="changeActive(index)">Activate</button>
                  </div>
                </div>
              </div>


            </div>
            <hr class="p-1 m-auto w-25">
            <div class="col-12 tip">{{b.description}}</div>
          </div>


        </div>
      </div>

        <hr class="p-1 m-auto w-25">

      <div class="btn btn-success" @click="showNew()"> build new building</div>
      <div v-if="showNewBuilding" class="card p-2 m-3">
        <span class="tip">(Available to build)</span>
        <div v-for="(build, i) in buildingsList" class="p-1 m-1 border">
          <div class=""><h5>{{build.displayName}}</h5></div>
          <div class="tip">{{build.description}} </div>
          <button class="btn btn-success" v-if="checkIfCanBeBuild(build.cost_of_build)" @click="addNewBuilding(i)">Build</button>
          <hr class="p-1 m-auto w-25">
          <div v-if="!checkIfCanBeBuild(build.cost_of_build)" >
            <span class="tip color-red">Not enought resources to build this building you need:</span>
            <div v-for="b in build.cost_of_build">
              {{b.name}} - {{b.amount}}
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import buildings from '@/assets/buildings.json'

export default{
  name: 'Village',
  data(){
    return{
      buildingsList: buildings,
      showNewBuilding: false

    }
  },
  computed:{
    warehouse:{
      get: function(){
        return this.$store.state.warehouse;
      },
      set: function(wh){
        this.$store.state.warehouse = wh;
      }
    },
    buildings:{
      get: function(){
        return this.$store.state.buildings;
      },
      set: function(bu){
        this.$store.state.buildings = bu;
      }
    }
  },
  methods:{
    checkIfCanBeBuild(requirements){
      let requirementsTbl =[];
      for (var i = 0; i < this.warehouse.length; i++) {
        requirements.forEach((element)=>{
          if(this.warehouse[i].name == element.name &&
            this.warehouse[i].amount>=element.amount){
            requirementsTbl.push(true);
          }
        });
      }
      let endPoint = false;
      console.log(requirementsTbl);
      if(requirementsTbl[0]!=null){
        endPoint=true;
      }
      return endPoint;
    },
    showNew(){
      this.showNewBuilding = true;
    },
    addNewBuilding(index){
      this.buildings.push(this.buildingsList[index]);

      for (var i = 0; i < this.warehouse.length; i++) {
        this.buildingsList[index].cost_of_build.forEach((element)=>{
          if(this.warehouse[i].name == element.name)
            {
              this.warehouse[i].amount-=element.amount
            }
        });
      }

      this.showNewBuilding =false;
    },
    changeActive(index){
      this.buildings[index].isActive = !this.buildings[index].isActive
    },
    increaseWorkers(index){
      if(this.buildings[index].workers_active<this.buildings[index].workers_needed
          && this.$store.state.available_people>=1){
        this.buildings[index].workers_active++;
        this.$store.state.available_people--;
      }
      this.buildings[index].isActive=true;
    },
    decreaseWorkers(index){
      if(this.buildings[index].workers_active>0){
        this.buildings[index].workers_active--;
        this.$store.state.available_people++;
      }
      if(this.buildings[index].workers_active<=0){
        this.buildings[index].isActive=false;
      }
    }
  }
}
</script>

<style>
img{
  width: 60px;
  height: 60px;
}
.name{
  text-transform:capitalize;
  min-width: 100px;
}
.btn-add{
  width: 25px;
  height: 25px;
  border: 1px solid silver;
  padding: 0;
}
.infoSqr{
  min-width: 150px;

}
.color-red{
  color: red !important;
}

</style>
