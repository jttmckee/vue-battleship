import { mount } from '@vue/test-utils'
import Gameboard from './Gameboard.vue'

let vm
beforeEach(() => {
  vm = mount(Gameboard, { propsData: { width: 10 } }).vm
})

describe('Gameboard setup', () => {
  test('Places ship at coordinate', () => {
    vm.newShip({ start: { x: 2, y: 2 }, end: { x: 4, y: 2 } })
    expect(vm.ships.length).toBe(1)
    expect(vm.$refs.ships.length).toBe(1)
  })
  test('Places ship at boundary', () => {
    vm.newShip({ start: { x: 9, y: 9 }, end: { x: 9, y: 4 } })
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
