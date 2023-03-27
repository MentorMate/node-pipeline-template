import { createTodoDTO, todoDTO } from '../dto';
import { asyncHandler, defineRoute, response } from '../../../utils';

export default defineRoute({
  operationId: 'todo-create',
  summary: 'Create a To-Do',
  description: 'Create a new To-Do item',
  tags: ['Todo'],
  method: 'post',
  path: '/',
  authenticate: true,
  request: {
    body: createTodoDTO,
  },
  responses: {
    201: todoDTO,
    409: response.Conflict(),
    422: response.UnprocessableEntity(),
  },
}).attachHandler(
  asyncHandler(async ({ body, services }, res) => {
    const todo = await services.todosService.create(body);

    res.status(201).send(todo);
  })
);
