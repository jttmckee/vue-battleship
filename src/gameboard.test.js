import { mount } from '@vue/test-utils'
import Gameboard from './Gameboard.vue'
import Ship from './Ship.vue'
import Vue from 'vue'

let vm
let wrapper
beforeEach(() => {
  vm = mount(Gameboard, { propsData: { width: 10, player: true } }).vm
})

describe('Gameboard setup', () => {
  test('Places ship at coordinate', () => {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    expect(vm.ships.length).toBe(1)
    expect(vm.$refs.ships.length).toBe(1)
  })
  test('Places ship at boundary', () => {
    vm.newShip({ start: { x: 9, y: 9 }, end: { x: 9, y: 5 } })
    expect(vm.ships.length).toBe(1)
    expect(vm.$refs.ships.length).toBe(1)
  })
  test('Cant add too big a ship', () => {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 10, y: 2 } })
    expect(vm.ships.length).toBe(0)
  })
})

describe('Gameboard functionality', () => {
  beforeEach(() => {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
  })
  test('Cant add a ship at same location as another', () => {
    vm.newShip({ start: { x: 4, y: 2 }, end: { x: 5, y: 2 } })
    expect(vm.ships.length).toBe(1)
  })
  test('receiveAttack hits ship if present', () => {
    vm.receiveAttack({ x: 3, y: 2 })
    expect(vm.$refs.ships[0].hits.length).toBe(1)
  })
  test('receiveAttack doesnt hit ship if not present and adds missed attack', () => {
    vm.receiveAttack({ x: 5, y: 2 })
    expect(vm.$refs.ships[0].hits.length).toBe(0)
    expect(vm.missedAttacks[0]).toEqual({ x: 5, y: 2 })
  })
  test('reports if all ships sunk', () => {
    vm.newShip({ start: { x: 4, y: 4 }, end: { x: 4, y: 5 } })
    vm.receiveAttack({ x: 2, y: 2 })
    vm.receiveAttack({ x: 3, y: 2 })
    vm.receiveAttack({ x: 4, y: 2 })
    vm.receiveAttack({ x: 4, y: 4 })
    vm.receiveAttack({ x: 4, y: 5 })
    expect(vm.allShipsSunk()).toBe(true)
  })
  test('receiveAttack returns false if it has already hit that location', () =>{
    expect(vm.receiveAttack({ x: 2, y: 2 })).toBe(true)
    expect(vm.receiveAttack({ x: 2, y: 2 })).toBe(false)
  })
  test('receiveAttack returns false if it has already missed ', () => {
    expect(vm.receiveAttack({ x: 1, y: 1 })).toBe(true)
    expect(vm.receiveAttack({ x: 1, y: 1 })).toBe(false)
  })
})

describe('Gameboard display', () => {
  let wrapper
  let wrapperComputer
  let vmComputer
  beforeEach(() => {
    wrapper = mount(Gameboard, { propsData: { width: 10, player: true } })
    wrapperComputer = mount(Gameboard, { propsData: { width: 10, player: false } })
    vm = wrapper.vm
    vmComputer = wrapperComputer.vm
  })

  test('dummy test', ()=> {
    expect(wrapper.findAll('div[class="test"]').length).toBe(2)
  })
  test('number of blank sea tiles is 100 if no ships', ()=> {
    expect(wrapper.findAll('div[class="sea-tile tile"]').length).toBe(100)
  })
  test('number of blank sea tiles is 100 minus length of ships', ()=> {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    vm.newShip({ start: { x: 5, y: 4 }, end: { x: 5, y: 5 } })
    expect(wrapper.findAll('div[class="sea-tile tile"]').length).toBe(95)
  })
  test('number of blank sea tiles is 100 minus length of ships - missed attacks', ()=> {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    vm.newShip({ start: { x: 5, y: 4 }, end: { x: 5, y: 5 } })
    vm.receiveAttack({ x: 2, y: 2 })
    vm.receiveAttack({ x: 8, y: 8 })
    expect(wrapper.findAll('div[class="sea-tile tile"]').length).toBe(94)
  })
  test('number of blank sea tiles is 0 if there is no player', ()=> {
    vmComputer.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    vmComputer.newShip({ start: { x: 5, y: 4 }, end: { x: 5, y: 5 } })
    expect(wrapperComputer.findAll('div[class="sea-tile tile"]').length).toBe(0)
  })
  test('number of blank mist tiles is 100 minus -  attacks', ()=> {
    vmComputer.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    vmComputer.newShip({ start: { x: 5, y: 4 }, end: { x: 5, y: 5 } })
    vmComputer.receiveAttack({ x: 2, y: 2 })
    vmComputer.receiveAttack({ x: 8, y: 8 })
    expect(wrapperComputer.findAll('div[class="mist-tile tile"]').length).toBe(98)
  })
})

describe('Ship styles', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(Gameboard, { propsData: { width: 10, player: true }})
    vm = wrapper.vm
  })
  test('position styles attach to ship', ()=> {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    expect(vm.ships[0].style.gridColumnStart).toBe('3')
    expect(vm.ships[0].style.gridColumnEnd).toBe('6')
    expect(vm.ships[0].style.gridRowStart).toBe('3')
    expect(vm.ships[0].style.gridRowEnd).toBe('4')
  })
  test('ship rotates when along y axis', () => {
    vm.newShip({ start: { x: 2, y: 4 }, end: { x: 2, y: 2 } })
    expect(vm.$refs.ships[0].rotated).toBe(true)
  })
  test('ship doesnt rotate when along x axis', () => {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    expect(vm.$refs.ships[0].rotated).toBe(false)
  })
})

describe('Random Ship', () => {
  beforeEach( () => {  let wrapper
    wrapper = mount(Gameboard, { propsData: { width: 5, player: true }})
    vm = wrapper.vm
  })
  test('randomShip places a ship randomly not overlapping  another ship', () => {
    vm.newShip({ start: { x: 0, y: 0 }, end: { x: 2, y: 0 } })
    vm.randomShip(3)
    expect(vm.$refs.ships.length).toBe(2)
    expect(vm.ships[1].size).toBe(3)
  })

})

describe('Player interactions', () => {
  beforeEach( () => {
    wrapper = mount(Gameboard, { propsData: { width: 10, player: false }})
    vm = wrapper.vm
  })
  test('Player clicking tile with ship results in hit', ()=> {
    vm.newShip({ start: { x: 0, y: 0 }, end: { x: 2, y: 0 } })
    const tile = wrapper.find('.mist-tile')
    tile.trigger('click')
    expect(vm.hits.length).toBe(1)

  })
  xtest('Player clicking tile with ship results in miss', ()=> {

  })
  xtest('Player can only play when it is their turn', ()=> {

  })
})
