import { todo as todoSchema } from '@common/data/models';

export const todoDTO = todoSchema.openapi({ ref: 'Todo' });
