<template>
  <div>
    <div class="container-fluid m-auto" v-if="!gameOver">
      <div>

        <div class="justify-content-center m-2 row">
          <img class="logo col-5 col-md-3" src="@/assets/logo.jpg">
          <span v-if="!nameEdit" class="col-12 col-md-6 m-2 mt-3" @click="nameEdit=true">

            <h5>{{villageName}}</h5>
          </span>
          <form v-if="nameEdit"  @submit.prevent="changeName()">
            <input type="text" class="col-12 col-md-3 m-2 mt-3" v-model="villageName" >

          </form>
          <button class="btn btn-success float-right m-1 col-12 col-md-6" @click="nextTurn()">Next turn</button>
        </div>
        <div class="row justify-content-around">
          <span class="m-2 mt-3"><h5><img class="icon" src="@/assets/images/human.png"> {{availablePeople}} / {{maxPeople}} </h5></span>
          <span class="m-2 mt-3"><h5><img class="icon" src="@/assets/images/clock.png"> {{turns}}</h5></span>
          <span class="m-2 mt-3"><h5><img class="icon" src="@/assets/images/food.png"> {{food}}</h5></span>
          <span class="m-2 mt-3"><h5>&#9737; {{coins}}</h5></span>
          <span class="m-2 mt-3"><h5>&#10025; {{points}}</h5></span>

        </div>
        <div class="row">
          <button class="btn btn-light m-2 menuitem" @click="setMenuItem('warehouse')">Warehouse</button>
          <button class="btn btn-light m-2 menuitem" @click="setMenuItem('village')">Village</button>
          <button class="btn btn-light m-2 menuitem" @click="setMenuItem('field')">Fields</button>
          <button class="btn btn-light m-2 menuitem" @click="setMenuItem('info')">Info</button>

        </div>

      </div>
      <div class="m-auto elements p-2">
        <Warehouse class="w-100" v-if="menuItem=='warehouse'"></Warehouse>
        <Village class="w-100" v-if="menuItem=='village'"></Village>
        <Field v-if="menuItem=='field'"></Field>
        <Info v-if="menuItem=='info'"></Info>
      </div>
    </div>
    <div class="container-fluid m-auto" v-if="gameOver">
      <h1>GAME OVER</h1>
      <hr class="p-1 m-auto w-25">
      <h2>Score: {{points}}</h2>
      <form>
        <button class="btn btn-success">Restart game</button>
      </form>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Warehouse from '@/components/Warehouse.vue'
import Village from '@/components/Village.vue'
import resources from '@/assets/resources.json'
import buildingsDB from '@/assets/buildings.json'
import Field from '@/components/Field.vue'
import Info from '@/components/Info.vue'

export default {
  name: 'home',
  data(){
    return{
      resources: resources,
      buildingsDB: buildingsDB,
      menuItem: 'warehouse',
      villageName: this.$store.state.village_name,
      baseProductionFactor: 4,
      turns:0,
      nameEdit: false,
      gameOver: false
    }
  },
  computed: {
    coins:{
      get: function(){
        return this.$store.state.coins;
      },
      set: function(co){
        this.$store.state.coins=co;
      }
    },
    buildings:{
      get: function(){
        return this.$store.state.buildings;
      },
      set: function(bu){
        return this.$store.state.buildings=bu;
      }
    },
    availablePeople(){
      return this.$store.state.available_people;
    },
    food:{
      get: function(){
        return this.$store.state.warehouse[0].amount;
      },
      set: function(am){
        this.$store.state.warehouse[0].amount=am
      }

    },
    warehouse:{
      get: function(){
        return this.$store.state.warehouse;
      },
      set: function(wh){
        this.$store.state.warehouse=wh;
      }
    },
    maxPeople(){
      return this.$store.state.max_people
    },
    points:{
      get: function(){
        return this.$store.state.points;
      },
      set: function(pt){
        this.$store.state.points=pt;
      }
    }
  },
  components: {
    Warehouse,
    Village,
    Field,
    Info
  },
  methods: {
    changeName(){
      this.nameEdit = false;
    },
    nextTurn(){
      /*for (var i = 0; i < this.$store.state.warehouse.length; i++) {
        this.$store.state.warehouse[i].amount ++;
      }*/
      //console.log("teoretycznie koniec tury");
      this.addingProducts();
      this.addingRawMaterials();
      this.feedingPeople();
      this.turns++;
    },
    feedingPeople(){
      //odejmujemy żywnośc - po 1 sztuce każdego rodzaju na każdego mieszkańca.
      //każdy dostępny rodzaj jedzenia zwiększa ogólne szczęście o 1

      //Sumarizng alld available food in warehouse

      let diff = this.food- (this.$store.state.max_people*2);
      if(diff>=0){

        this.food-=this.$store.state.max_people*2;
        if(this.food>this.$store.state.max_people){
          this.$store.state.max_people++;
          this.$store.state.available_people++;
          this.points++;
        }
      }
      else{

        let people_to_die = Math.abs(diff / 2);
        this.points-=people_to_die;
        this.food-=this.$store.state.max_people*2;
        for (var i = 0; i < people_to_die; i++) {
          if(this.$store.state.available_people>0){
            this.$store.state.available_people--;

          }
          else{
            let workerCounter = 0;
            this.buildings.forEach((building)=>{
              if(building.workers_active>0){
                building.workers_active--;
                workerCounter++;
              }
            });

            if(workerCounter<=0){//w budynkach w mieście nie ma już pracowników, sprawdzamy budynki na polu,
              //jeśli i one puste, to sprawdzamy same pola
              this.$store.state.map.forEach((field)=>{
              if(field.workers>0){
                field.workers--;
              }
              });
            }
          }
          this.$store.state.max_people--;
        }
        if(this.maxPeople<=0){
          this.gameOver = true;
        }

        //remove people from available a potem z każdej produkcji
      }

    },
    addingRawMaterials(){
      //tutaj będa sprawdzane surowce pobierane z ziemi / kamień, złoto, drewno, owoce, warzywa itp/
      //czyli sprawdzamy tutaj pracę na polach
      for (var i = 0; i < this.$store.state.map.length; i++) {
        //console.log("pole o nr: "+i+" ma zapodanych workersów: "+this.$store.state.map[i].workers);
        for (var j = 0; j < this.warehouse.length; j++) {
          //TODO: UWAGA! Produkcja z pól bez budynków tylko pierwszego elementu w tabeli
          if(this.$store.state.map[i].workers>0){
              if(this.warehouse[j].name==this.$store.state.map[i].resource[this.$store.state.map[i].material_index]){
                let producedValue = (this.$store.state.map[i].workers + this.$store.state.map[i].buildingLvl) * this.$store.state.map[i].basic_yield;
                this.warehouse[j].amount+=producedValue;
                this.points+=producedValue;
                this.$store.state.map[i].amount-=producedValue;
              }
          }
        }
      }
    },
    setMenuItem(item){
      this.menuItem=item;
    },
    addingProducts(){
      //tutaj sprawdzamy co produkujemy w budynkach
      for (var i = 0; i < this.buildings.length; i++) {
        this.buildings[i].production.forEach((element)=>{
          if(this.buildings[i].isActive){
            for (var j = 0; j < this.warehouse.length; j++) {

              let canProduce = true;

              if(this.warehouse[j].name==element.input){
                let diff = this.warehouse[j].amount;
                diff-=element.needed_amount;

                if(diff<0){
                  canProduce=false;
                }
                if(canProduce){
                  this.warehouse[j].amount-=element.needed_amount;
                  for (var k = 0; k < this.warehouse.length; k++) {
                    if(this.warehouse[k].name==element.name && canProduce){
                      this.warehouse[k].amount+=element.base_amount * this.buildings[i].workers_active;
                      this.points+=element.base_amount * this.buildings[i].workers_active;
                    }
                  }
                }
              }//Koniec sprawdzania czy element jest surowcem
            }
          }
        });
      }
    }
  },
  created(){
    this.$store.state.warehouse = resources.map(el=>{
      return {
        "name":el.name,
        "displayName":el.displayName,
        "categories": el.categories,
        "amount":10,
        "buy_value": el.buy_value
      }
    })
    //console.log(this.$store.state.warehouse);
    this.buildings.push(buildingsDB[0]);
    this.buildings.push(buildingsDB[1]);
    //console.log(this.buildings);
  }
}
</script>
<style>
.elements{
  max-width: 900px;
}
.icon{
  width: 20px;
  height: 20px;
}
.btn-light{
  border-color: silver;
  border-bottom: 0px;
  background-color: white;
}
.tip{
  font-size: 90%;
  font-style: italic;
  color: gray;
}
.container-fluid{
  max-width: 900px;
}
.logo{
  width: 150px;
  height: 60px;
}
</style>
