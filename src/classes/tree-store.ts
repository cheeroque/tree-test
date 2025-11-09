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

  #map: Record<TreeItemId, TreeItem> = {}
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
    return this.#map[id]
  }

  // Get direct children of an item by its id
  getChildren(id: TreeItemId) {
    const item = this.getItem(id)

    if (!item) {
      return []
    }

    return item.children.slice(0)
  }

  // Get all children by item id, including nested
  getAllChildren(id: TreeItemId) {
    const children = this.getChildren(id)

    for (const child of children) {
      if (child.children.length) {
        children.push(...this.getAllChildren(child.id))
      }
    }

    return children
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
    this.#map = this.items.reduce<Record<TreeItemId, TreeItem>>((result, item) => {
      result[item.id] = {
        ...item,
        children: [],
      }

      return result
    }, {})

    const tree: TreeItem[] = []

    this.items.forEach((item) => {
      if (item.parent && this.#map[item.parent]) {
        this.#map[item.parent]!.children.push(this.#map[item.id]!)
      }
      else {
        tree.push(this.#map[item.id]!)
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
