import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import TreeTable from './TreeTable.vue'
import { items } from '@/data/tree-items'
import { waitForEvent } from '@/utils/test'

describe('Tree Table test with default data', () => {
  let wrapper: VueWrapper

  test.beforeEach(async () => {
    wrapper = mount(TreeTable, {
      props: {
        animateRows: false,
        items,
      },
    })

    await waitForEvent(wrapper, 'gridReady')
  })

  test('renders all items', () => {
    expect(wrapper.find('.ag-viewport')).toBeDefined()
    expect(wrapper.findAll('.ag-viewport .ag-row').length).toBe(items.length)
    expect(wrapper.find('.ag-viewport .ag-row [col-id="label"]').text()).toBe('Айтем 1')
  })

  test('renders row numbers', () => {
    const cells = wrapper.findAll('.ag-viewport .ag-row-group [col-id="index"]')

    cells.forEach((cell, index) => {
      expect(cell.text()).toBe(String(index + 1))
    })
  })

  test('renders correct row categories', () => {
    const groupColumn = wrapper.find('.ag-viewport .ag-row-group [col-id="ag-Grid-AutoColumn"]')
    expect(groupColumn).toBeDefined()
    expect(groupColumn.classes()).toContain('cell-group')

    const itemColumn = wrapper.find('.ag-viewport .ag-row:not(.ag-row-group) [col-id="ag-Grid-AutoColumn"]')
    expect(itemColumn).toBeDefined()
    expect(itemColumn.classes()).toContain('cell-item')
  })

  test('handles row collapsing and expanding', async () => {
    const groupCollapseTrigger = wrapper.find('.ag-viewport .ag-row-group .ag-group-expanded')
    const groupExpandTrigger = wrapper.find('.ag-viewport .ag-row-group .ag-group-contracted')

    expect(groupExpandTrigger.attributes('aria-hidden')).toBe('true')

    await groupCollapseTrigger.trigger('click')

    expect(groupCollapseTrigger.attributes('aria-hidden')).toBe('true')
    expect(groupExpandTrigger.attributes('aria-hidden')).toBe('false')

    // Wait for collapsed rows to be removed from DOM
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 50))

    expect(wrapper.findAll('.ag-viewport .ag-row').length).toBe(1)

    await groupExpandTrigger.trigger('click')

    expect(groupExpandTrigger.attributes('aria-hidden')).toBe('true')
    expect(groupCollapseTrigger.attributes('aria-hidden')).toBe('false')

    // Wait for expanded rows to be mouted back to DOM
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 50))

    expect(wrapper.findAll('.ag-viewport .ag-row').length).toBe(items.length)
  })
})
