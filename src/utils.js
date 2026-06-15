import Dexie from 'dexie';

export const db = new Dexie('todo-list-db');
db.version(2).stores({
  lists: '++id, name',
  listItems: '++id, name, checked, listId',
});

export const APIs = {
  TodoLists: 'todo-lists',
  TodoListsUpdate: 'todo-lists-update',
  TodoListsDelete: 'todo-lists-delete',
  TodoList: 'todo-list',
  TodoListDelete: 'todo-list-delete',
  TodoListUpdate: 'todo-list-update',
  TodoListClearCompleted: 'todo-list-clear-completed',
};

export async function fetcher({ url, ...variables }) {
  switch (url) {
    case APIs.TodoLists:
      return db.lists.toArray();
    case APIs.TodoList:
      return {
        ...(await db.lists.get(variables.id)),
        items:
          (await db.listItems.where({ listId: variables.id }).toArray()) ?? [],
      };
    default:
      throw new Error(`Unknown API ${url}`);
  }
}

export async function putter({ url, id, ...variables }) {
  switch (url) {
    case APIs.TodoLists:
      return db.lists.add({ name: variables.name, icon: variables.icon });
    case APIs.TodoListsUpdate:
      return db.lists.update(id, { name: variables.name });
    case APIs.TodoListsDelete:
      return db.transaction('rw', db.lists, db.listItems, async () => {
        await db.listItems.where({ listId: id }).delete();
        await db.lists.delete(id);
      });
    case APIs.TodoList:
      return db.listItems.add({ listId: id, name: variables.name });
    case APIs.TodoListDelete:
      return db.listItems.delete(id);
    case APIs.TodoListUpdate:
      return db.listItems.update(id, variables);
    case APIs.TodoListClearCompleted:
      return db.listItems.where({ listId: id, checked: true }).delete();
    default:
      throw new Error(`Unknown API ${url}`);
  }
}