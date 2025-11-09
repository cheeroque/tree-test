<script setup lang="ts">
import { ClientSideRowModelModule, ModuleRegistry, type ColDef } from 'ag-grid-community'
import { TreeDataModule } from 'ag-grid-enterprise'
import { AgGridVue } from 'ag-grid-vue3'
import { computed, ref } from 'vue'

import { TreeStore, type TreeItemBase } from '@/classes/tree-store'

ModuleRegistry.registerModules([ClientSideRowModelModule, TreeDataModule])

const { items = [] } = defineProps<{
  items?: TreeItemBase[]
}>()

const rowData = computed(() => new TreeStore(items).tree)

const columnDefs = ref<ColDef[]>([
  {
    field: 'index',
    flex: 3,
    headerName: '№ п/п',
    initialPinned: 'left',
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
  valueGetter: (row) => (row.data?.children?.length ? 'Группа' : 'Элемент'),
})
</script>

<template>
  <AgGridVue
    :auto-group-column-def
    :column-defs
    :group-default-expanded="-1"
    :row-data
    dom-layout="autoHeight"
    tree-data
    tree-data-children-field="children"
  />
</template>

<style scoped>
:deep(.ag-header-cell),
:deep(.ag-row-group) {
  font-weight: 700;
}
</style>
