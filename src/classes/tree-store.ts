export type TreeItemId = number | string

export interface TreeItemBase {
  id: TreeItemId
  parent: TreeItemId | null
  label: string
}

interface TreeItem extends TreeItemBase {
  children: TreeItem[]
}

export class TreeStore {
  items: TreeItemBase[] = []

  #cleanMap: Record<TreeItemId, TreeItemBase> = {}
  #treeMap: Record<TreeItemId, TreeItem> = {}
  #tree: TreeItem[] = []

  constructor(items: TreeItemBase[]) {
    this.items = items
    this.#init()
  }

  // Get all items
  getAll() {
    return this.items
  }

  // Get item by id
  getItem(id: TreeItemId) {
    return this.#cleanMap[id]
  }

  // Get direct children of an item by its id
  getChildren(id: TreeItemId) {
    const item = this.#treeMap[id]

    if (!item) {
      return []
    }

    return item.children.map(({ id }) => this.getItem(id)!)
  }

  // Get all children by item id, including nested
  getAllChildren(id: TreeItemId) {
    const result = this.getChildren(id)

    for (const child of result) {
      if (child && this.#treeMap[child.id]?.children.length) {
        result.push(...this.getAllChildren(child.id))
      }
    }

    return result
  }

  // Get all parents of an item, up to the topmost level
  getAllParents(id: TreeItemId) {
    return this.#getParents(id, [])
  }

  // Add item
  addItem(item: TreeItemBase) {
    this.items.push(item)
    this.#init()
  }

  // Remove item by its id, with all its children
  removeItem(id: TreeItemId) {
    const childrenIds = this.getAllChildren(id).map(({ id }) => id)
    this.items = this.items.filter((item) => ![id, ...childrenIds].includes(item.id))

    this.#init()
  }

  // Update item
  updateItem(item: TreeItemBase) {
    const index = this.items.findIndex(({ id }) => id === item.id)

    if (index < 0) {
      return
    }

    this.items.splice(index, 1, item)
    this.#init()
  }

  get tree() {
    return this.#tree
  }

  // Build hash map & tree of items
  #init() {
    this.#cleanMap = {}
    this.#treeMap = {}

    this.items.forEach((item) => {
      this.#cleanMap[item.id] = item
      this.#treeMap[item.id] = {
        ...item,
        children: [],
      }
    })

    const tree: TreeItem[] = []

    this.items.forEach((item) => {
      if (item.parent && this.#treeMap[item.parent]) {
        this.#treeMap[item.parent]!.children.push(this.#treeMap[item.id]!)
      }
      else {
        tree.push(this.#treeMap[item.id]!)
      }
    })

    this.#tree = tree
  }

  // Get parents recursively
  #getParents(id: TreeItemId, parents: TreeItemId[]) {
    const item = this.getItem(id)

    if (item && item.parent) {
      parents.push(item.parent)
      this.#getParents(item.parent, parents)
    }

    return parents
  }
}
