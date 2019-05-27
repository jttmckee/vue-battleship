import { mount } from '@vue/test-utils'
import Ship from './Ship.vue'

let wrapper
let vm

beforeEach(() => {
  wrapper = mount(Ship, { propsData: { size: 3 } })
  vm = wrapper.vm
})

describe('Ship', () => {
  test('hit() adds a hit', () => {
    vm.hit(1)

    expect(vm.hits.length).toBe(1)
  })
  test('hit() only works on one location once', () => {
    vm.hit(1)
    vm.hit(1)
    expect(vm.hits.length).toBe(1)
  })
  test('hit() only works on location in ship', () => {
    vm.hit(6)
    expect(vm.hits.length).toBe(0)
  })
  test('isSunk() returns true if all positions hit', () => {
    vm.hit(0)
    vm.hit(1)
    vm.hit(2)
    expect(vm.isSunk()).toBe(true)
  })
  test('isSunk() returns false if no positions hit', () => {
    expect(vm.isSunk()).toBe(false)
  })
  test('isSunk() returns false if not all positions hit', () => {
    vm.hit(0)
    vm.hit(1)
    expect(vm.isSunk()).toBe(false)
  })
})
