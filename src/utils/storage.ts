import type { Todo } from '../types/todo';

const TODO_STORAGE_KEY = 'gxk-todo-list';

export function getTodos(): Todo[] {
  try {
    const raw = window.localStorage.getItem(TODO_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Todo[]) : [];
  } catch (error) {
    console.error('读取本地任务数据失败:', error);
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('写入本地任务数据失败:', error);
  }
}
