import { Update } from '@database/operations';
import { Todo } from './todo.entity';

export type UpdateTodo = Update<Pick<Todo, 'name' | 'note' | 'completed'>>;
