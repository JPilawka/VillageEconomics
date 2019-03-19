<template>
  <div>
    <H2>Warehouse</h2>
    <div class="row m-4">
      <div v-for="(r, index) in resources" :key="r.name" class="d-flex res m-2 p-1"
      :style="{backgroundImage: 'url('+require('@/assets/images/resources/'+r.name+'.png')+')'}"
      @click="selectItem(index)">
        <div class="displayName">{{r.displayName}}</div>
        <div class="amount">{{r.amount}}</div>
      </div>
    </div>

    <h2>Trade</h2>
    <div class="card p-2 m-3" v-if="ind!=null">
      <h5>Exchange</h5>
      <h3 class="card-title>">{{displayName}}</h3>
      <div class="res m-2 p-1 m-auto"
      :style="{backgroundImage: 'url('+require('@/assets/images/resources/'+resources[ind].name+'.png')+')'}"
      @click="selectItem(index)">
        <div class="displayName" style="font-size: 105%">{{resources[ind].displayName}}</div>
        <div class="amount special"><h5>{{resources[ind].amount}}</h5></div>
      </div>
      <hr class="p-1 m-auto w-25">
      <div class="card-body>">
        <span class="tip">(Here you can exchange meterials)</span>
        <div class="justify-content-around row">
              <div class="m-3 p-3 col-3 tip">
                Amount
              </div>
              <div class="m-3 p-3 col-3 tip">
                Buy / Sell Value
              </div>
              <div class="m-3 p-3 col-3 tip">
                Action
              </div>
        </div>

        <div class="justify-content-around row">
          <div class="m-2 p-2 exchange-item col-3">
            <button class="btn btn-add" @click="addToBuy(-1)">-</button>
            <span class="m-2">{{amountToBuy}}</span>
            <button class="btn btn-add" @click="addToBuy(1)">+</button>
          </div>
          <div class="m-2 p-2 exchange-item col-3">
            &#9737; {{coinsOnBuy}}
          </div>
          <div class="m-2 p-2 exchange-item col-3">
            <button v-if="canBuy" class="btn btn-success" @click="buy()">BUY</button>
          </div>
        </div>

        <div class="justify-content-around row">
          <div class="m-2 p-2 exchange-item col-3">
            <button class="btn btn-add" @click="addToSell(-1)">-</button>
            <span class="m-2">{{amountToSell}}</span>
            <button class="btn btn-add" @click="addToSell(1)">+</button>
          </div>
          <div class="m-2 p-2 exchange-item col-3">
            &#9737; {{coinsOnSell}}
          </div>
          <div class="m-2 p-2 exchange-item col-3">
            <button v-if="canSell" class="btn btn-success" @click="sell()">SELL</button>
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>

export default{
  name: 'Warehouse',
  data(){
    return{
      backgroundImage: "",
      ind: 0,
      displayName: "",
      coinsOnBuy: 0,
      coinsOnSell: 0,
      amountToBuy:0,
      amountToSell:0,
      canBuy: false,
      canSell: false
    }
  },
  beforeUpdate(){
    if(this.amountToBuy<=0){
      this.canBuy=false;
    }
    if(this.amountToSell<=0){
      this.canSell=false;
    }
  },
  computed:{
    resources:{
      get: function(){
        return this.$store.state.warehouse;
      },
      set: function(rs){
        this.$store.state.warehouse = rs;
      }
    },
    coins:{
      get: function(){
        return this.$store.state.coins;
      },
      set: function(co){
        this.$store.state.coins=co;
      }
    }
  },
  methods:{
    selectItem(i){
      this.ind = i;
      this.displayName = this.resources[i].displayName;

    },
    backgroundImg(img){
      this.backgroundImage = "@/assets/images/resources/"+img;
    },
    addToBuy(v){
      if((this.amountToBuy+v>=0 && (this.coins - this.amountToBuy*this.resources[this.ind].buy_value)>0)){
        this.amountToBuy+=v;
        this.coinsOnBuy = this.amountToBuy*this.resources[this.ind].buy_value;
        if(this.coins>=this.coinsOnBuy){
          this.canBuy = true;
        }
      }
    },
    addToSell(v){
      if((this.amountToSell+v>=0 && this.amountToSell+v<=this.resources[this.ind].amount)){
        this.amountToSell+=v;
        this.coinsOnSell = this.amountToSell*0.5*this.resources[this.ind].buy_value;
        this.canSell = true;
      }
      if(this.amountToSell<=0 || this.amountToSell>this.resources[this.ind].amount){
        this.canSell = false;
      }
    },
    buy(){
      this.resources[this.ind].amount+=this.amountToBuy;
      this.coins-=this.coinsOnBuy;
      this.points+=this.coins;
      this.cleanTrade();
    },
    sell(){
      if(this.resources[this.ind].amount-this.amountToSell>=0){
        this.resources[this.ind].amount-=this.amountToSell;
        this.coins+=this.coinsOnSell;

        this.cleanTrade();
      }
      else{
        this.canSell = false;
      }
    },
    cleanTrade(){
      this.amountToBuy= 0;
      this.coinsOnBuy= 0;
      this.amountToSell= 0;
      this.coinsOnSell= 0;
    }
  }

}
</script>

<style>

.res{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid silver;
  position: relative;
}
.amount{
  position: absolute;
  bottom: -5px;
  right: 12px;
  width: 50px;
  background-color: rgba(0,0,0,0.7);
  color: white;
  font-weight: bold;
  z-index: 1;
}
.displayName{
  background-color: rgba(0,0,0,0.8);
  color: white;
  font-size: 13px;
  width: 86px;
  max-height: 30px;
  position: absolute;
  left: -5px;
  top: 28px;
}
.exchange-item{
  min-width: 100px;
}
.btn-ex{
  font-size: 150%;
  font-weight: bold;
  border: 1px solid silver;
  border-radius: 5px;
  max-height: 50px;
}
</style>
