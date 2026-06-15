import useSWR from 'swr';

import { APIs, fetcher, putter } from '../utils.js';

export function useTodoLists() {
  const { data = [], isLoading, mutate } = useSWR(
    { url: APIs.TodoLists },
    fetcher
  );

  return {
    data,
    isLoading,
    async newList(newListName, icon) {
      return await mutate(
        await putter({
          url: APIs.TodoLists,
          icon: icon || 'List',
          name: newListName,
        }),
        {
          populateCache: false,
          optimisticData: oldData => [
            ...oldData,
            { name: newListName, icon: icon || 'List', data: [] },
          ],
        }
      );
    },
    async updateList(listToUpdate, newListName) {
      await mutate(
        await putter({
          url: APIs.TodoListsUpdate,
          id: listToUpdate,
          name: newListName,
        }),
        {
          populateCache: false,
          optimisticData: oldData =>
            oldData.map(d => {
              if (d.id === listToUpdate) {
                return { ...d, name: newListName };
              }
              return d;
            }),
        }
      );
    },
    async deleteList(listToDelete) {
      return await mutate(
        await putter({
          url: APIs.TodoListsDelete,
          id: listToDelete,
        }),
        {
          populateCache: false,
          optimisticData: oldData =>
            oldData.filter(({ id }) => id !== listToDelete),
        }
      );
    },
  };
}