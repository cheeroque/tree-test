<script setup lang="ts">
import { CellStyleModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community'
import type { ColDef, GridOptions, GridReadyEvent, RowGroupOpenedEvent } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'
import { AgGridVue } from 'ag-grid-vue3'
import { computed, ref } from 'vue'

import { TreeStore, type TreeItemBase } from '@/classes/tree-store'

ModuleRegistry.registerModules([CellStyleModule, ClientSideRowModelModule, TreeDataModule])

const {
  animateRows = true,
  domLayout = 'autoHeight',
  items = [],
} = defineProps<Pick<GridOptions, 'animateRows' | 'domLayout'> & {
  items?: TreeItemBase[]
}>()

const emit = defineEmits<{
  gridReady: [GridReadyEvent]
  rowGroupOpened: [RowGroupOpenedEvent]
}>()

const rowData = computed(() => new TreeStore(items).tree)

const columnDefs = ref<ColDef[]>([
  {
    field: 'index',
    flex: 3,
    headerName: '№ п/п',
    valueGetter: (row) => row.node && Number(row.node.rowIndex) + 1,
  },
  {
    field: 'label',
    flex: 10,
    headerName: 'Наименование',
  },
])

const autoGroupColumnDef = ref<ColDef>({
  field: 'children',
  flex: 7,
  headerName: 'Категория',
  cellRendererParams: {
    suppressCount: true,
  },
  cellClass: (row) => row.data?.children?.length ? 'cell-group' : 'cell-item',
  valueGetter: (row) => row.data?.children?.length ? 'Группа' : 'Элемент',
})

function handleGridReady(event: GridReadyEvent) {
  const { api } = event

  api.setGridOption('suppressColumnMoveAnimation', true)
  api.moveColumns(['ag-Grid-AutoColumn'], 1)
  api.setGridOption('suppressColumnMoveAnimation', false)

  emit('gridReady', event)
}
</script>

<template>
  <AgGridVue
    :animate-rows
    :auto-group-column-def
    :column-defs
    :dom-layout
    :group-default-expanded="5"
    :row-data
    tree-data
    tree-data-children-field="children"
    @grid-ready="handleGridReady"
  />
</template>

<style scoped>
:deep(.ag-header-cell),
:deep(.ag-row-group) {
  font-weight: 700;
}
</style>
