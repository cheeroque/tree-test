import { describe, expect, test } from 'vitest'

import { TreeStore } from './tree-store'
import { items } from '@/data/tree-items'

describe('Tree Store test with default data', () => {
  let store: TreeStore

  test.beforeEach(() => {
    store = new TreeStore([...items])
  })

  test('getAll returns all items', () => {
    expect(store.getAll()).toStrictEqual(items)
  })

  test('getItem returns item by id', () => {
    expect(store.getItem(1)).toBeDefined()
    expect(store.getItem(1)!.label).toBe('Айтем 1')

    expect(store.getItem(100500)).toBeUndefined()
  })

  test('getChildren returns direct children of an item', () => {
    expect(store.getChildren(1).map(({ id }) => id)).toEqual(['91064cee', 3])
    expect(store.getChildren('91064cee').map(({ id }) => id)).toEqual([4, 5, 6])

    expect(store.getChildren('no-id')).toEqual([])
  })

  test('getAllChildren returns all nested children of an item', () => {
    expect(store.getAllChildren(1).map(({ id }) => id)).toEqual(['91064cee', 4, 7, 8, 5, 6, 3])
    expect(store.getAllChildren('91064cee').map(({ id }) => id)).toEqual([4, 7, 8, 5, 6])
  })

  test('getAllParents returns all parents of an item', () => {
    expect(store.getAllParents(1)).toEqual([])
    expect(store.getAllParents('91064cee')).toEqual([1])
    expect(store.getAllParents(7)).toEqual([4, '91064cee', 1])
  })

  test('addItem inserts new item to the store', () => {
    const newItem = { id: 'newitem', parent: 7, label: 'Item 9', data: [] }

    store.addItem(newItem)

    expect(store.getItem(newItem.id)).toStrictEqual(newItem)
    expect(store.getAll()).toContainEqual(newItem)
    expect(store.getChildren(newItem.parent).map(({ id }) => id)).toContain(newItem.id)
    expect(store.getAllParents(newItem.id)).toEqual([7, 4, '91064cee', 1])
  })

  test('removeItem removes item and all its children', () => {
    const itemIdToRemove = 4

    const lengthBefore = store.getAll().length
    const allChildren = store.getAllChildren(itemIdToRemove)

    store.removeItem(itemIdToRemove)

    const newLength = lengthBefore - allChildren.length - 1

    expect(store.getAll().length).toBe(newLength)
    expect(store.getItem(itemIdToRemove)).toBeUndefined()

    for (const child of allChildren) {
      expect(store.getItem(child.id)).toBeUndefined()
    }
  })

  test('updateItem updates an existing item in store', () => {
    const itemToUpdate = { id: 6, parent: 3, label: 'Айтем 6 (updated)', additionalData: 'somedata' }

    store.updateItem(itemToUpdate)

    expect(store.getItem(itemToUpdate.id)).toBeDefined()
    expect(store.getItem(itemToUpdate.id)!.label).toBe(itemToUpdate.label)
    expect(store.getChildren(itemToUpdate.id)).toEqual([])
    expect(store.getChildren(itemToUpdate.parent)).toContainEqual(itemToUpdate)
    expect(store.getAllParents(itemToUpdate.id)).toEqual([3, 1])

    store.updateItem({ id: 5555, parent: null, label: 'Non-existent item' })

    expect(store.getItem(5555)).toBeUndefined()
  })
})
