# economicgame

This is simple game based only on Vue. It works in one session locally. Nothing is saved anywhere, in browser in file or in database.

## Working example:
http://runestonedesigns.com/villageeconomics/

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# ABOUT GAME

## Goals

Main goal is not to loose workers. Game end when overall number of workers drops to zero. Additional goal is to collect points.

## Points
### You earn points from:
  Selling items (value in coins is added to points)

  Production value in village buildings and from field buildings

  For each new worker

You can also loose points when you loose workers

## Production
  Production occurs only when buildings or fields are staffed with workers and "active". You can deactivate buildings.

## Food and workers
  Each turn you ned to feed your workers. For each worker you need two units of food.

  It's good idea to build food generating buildings first (there are already Windmill and Bakery at the start in your village).

  If you have more food than twice as many as max workers you'll be granted additional workers

  If you don't have enough food your workers will be dying (as many as there's lack of food)
