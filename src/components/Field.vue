<template>
  <div>
    <H2>Map</h2>
    <div>
      <div class="row d-flex justify-content-center" v-for="row in cols">
        <div  v-for="square in rows[row-1]" class="mapSquare" :style="{backgroundImage: 'url('+require('@/assets/images/field/'+square.name+'.png')+')', fieldStyle}" @click="activate(square.index)">
          <div>{{square.resources}}</div>

          <div class="amount"><img src="@/assets/images/human.png">{{square.workers}}</div>
        </div>
      </div>
    </div>
<!--SZCZEGÓŁY -->
    <div class="card p-2 m-3" v-if="ind!=null">
      <h5>Field details</h5>
      <h3 class="card-title>">{{displayName}}</h3>
      <hr class="p-1 m-auto w-25">
      <div class="card-body>">
        <span class="tip">(As default only first resource can be exploited without building. To exploit other resource you must build apropriate building)</span>
        <hr class="p-1 m-auto w-25">
        <div>Resources left: {{amount}}</div>
        <hr class="p-1 m-auto w-25">
        <div>Workers: <br/>
        <button class="btn btn-add m-1" @click="decreaseWorkers(ind)">-</button>
        <span>{{workers}}</span>
        <button class="btn btn-add m-1" @click="increaseWorkers(ind)">+</button>
      </div>
      <hr class="p-1 m-auto w-25">
      <div v-if="buildingLvl>0">
        <h5>{{displayName}} upgrades: </h5>
        {{buildings[material_index]}} - {{buildingLvl}}

      </div>
      <div v-if="checkIfCanBeBuild(requirements)">
        Available buildings<br/>
        <span class="tip">(Only one can be build on each field)</span>
        <div  class="row p-1 m-1 border" v-for="(b, index) in buildings">
            <span class="col-5 "><h5>{{b}}</h5></span>
            <span class="tip col-3">produces {{resources[index]}} </span>
            <span class="p-1 col-1"><button class="btn btn-success" @click="buildUpgrade(ind,index)">Build</button> </span>
        </div>
      </div>
      <div v-if="!checkIfCanBeBuild(requirements) && buildingLvl<=0">
        <span class="tip">Not enought resources to build any building:</span>
        <div v-for="r in requirements">
          {{r[0]}} - {{r[1]}}
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import fieldTypes from '@/assets/field_types.json'

export default{
  name: 'Field',
  data(){
    return{
      fieldTypes: fieldTypes,
      rows:[],
      counter:1,
      isActive: false,
      resources: "",
      buildings:[],
      amount: 0,
      workers: 0,
      displayName:"",
      ind: null,
      mapSize: 25,
      requirements: [],
      buildingLvl: 0,
      material_index: 0
    }
  },
  computed:{
    fieldStyle(){
      return{
        border: this.isActive ? '2px solid red' : '1px solid black',
      }
    },
    map:{
      get: function(){
        return this.$store.state.map;
      },
      set: function(arr){
        this.$store.state.map=arr;
      }
    },
    warehouse: {
      get: function(){
        return this.$store.state.warehouse;
      },
      set: function(wh){
        this.$store.state.warehouse=wh;
      }
    }
  },
  created(){
    this.cols = Math.sqrt(this.mapSize);
    console.log(this.map);
    if(this.map[0]==null){
      this.generateMap();
    }
    else{
      this.map = this.$store.state.map;
    }
    this.populateRows()
     //UWAGA,mapa jest generowana z każdym odświeżeniem. Trzeba zrobić tak, że przy tworzeniu aplikacji tworzona jest mapa a tutaj tylko odtwarzana z localstorage
  },
  methods:{
    checkIfCanBeBuild(requirements){
      console.log(requirements);
      let requirementsTbl =[];
      for (var i = 0; i < this.warehouse.length; i++) {
        requirements.forEach((element)=>{
          if(this.warehouse[i].name == element[0] &&
            this.warehouse[i].amount>=element[1]){
            requirementsTbl.push(true);
          }
        });
      }
      let endPoint = false;
      console.log("wymagania budynków:"+requirementsTbl);
      if(requirementsTbl[0]!=null){
        endPoint=true;
      }
      return endPoint;
    },
    populateRows(){
      let row = [];
      for (var j = 0; j < this.cols; j++) {
        row.push([]);
      }
      let currentRow = 0;
      for (var i = 0; i < this.map.length; i++) {
        row[currentRow].push(this.map[i]);
        if(i>0 && (i+1)%this.cols==0){
          currentRow++;
          //console.log(currentRow);
        }
      }
      this.rows = row;
    },
    generateMap(){
      let map = [];
      for (var i = 0; i < this.mapSize; i++) {
        let randomIndex = this.randomRng(0,this.fieldTypes.length);
        //console.log(randomIndex);
        let fieldT = this.fieldTypes[randomIndex];
        //console.log(fieldT);
        let field = {
          "name" : fieldT.name,
          "displayName" : fieldT.displayName,
          "resource" : fieldT.resource,
          "amount" : this.randomRng(fieldT.min_amount, fieldT.max_amount),
          "building_name" : fieldT.building_name,
          "material_index" : 0,
          "buildingLvl" : fieldT.buildingLvl,
          "building_cost_per_lvl" : fieldT.building_cost_per_lvl,
          "basic_yield":fieldT.basic_yield,
          "workers":0,
          "index": i
        }

        map.push(field);
      }
      this.map = map;

    },
    randomRng(min, max){
      let r = Math.floor(Math.random()*(max-min)+min);
      return r;
    },
    decreaseWorkers(index){
      if(this.map[index].workers>0){
        this.map[index].workers--;
        this.$store.state.available_people++;
      }
      this.workers = this.map[index].workers;
    },
    increaseWorkers(index){
      if(this.$store.state.available_people>=1){
        this.map[index].workers++;
        this.$store.state.available_people--;
        this.workers = this.map[index].workers;
      }

    },
    activate(index){
      //this.isActive= true;
      this.displayName= this.map[index].displayName;
      this.resources=this.map[index].resource;
      this.amount=this.map[index].amount;
      this.workers=this.map[index].workers;
      this.buildings=this.map[index].building_name;
      this.requirements=this.map[index].building_cost_per_lvl;
      this.buildingLvl=this.map[index].buildingLvl;
      this.material_index = this.map[index].material_index;
      this.ind=index;
    },
    buildUpgrade(ind,index){
      this.map[ind].material_index = index;
      this.map[ind].buildingLvl++;

      this.material_index = index;
      this.buildingLvl++;

      for (var i = 0; i < this.warehouse.length; i++) {
        this.map[ind].building_cost_per_lvl.forEach((element)=>{
          if(this.warehouse[i].name == element[0])
            {
              this.warehouse[i].amount-=element[1];
            }
        });
      }
    }
  }
}
</script>

<style>
.mapSquare{
  width: 80px;
  height: 80px;
  border: 2px solid silver;
  border-radius: 5px;
  margin: 1px;
  position: relative;
}
.amount img{
  width: 18px;
  height: 18px;
  padding: 0px 2px 1px 0px;
}

</style>
