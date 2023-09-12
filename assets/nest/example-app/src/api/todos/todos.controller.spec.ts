import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosRepository } from './repositories/todos.repository';
import { Todo } from './entities/todo.entity';
import { Paginated } from '@utils/query/pagination';
import { DatabaseModule } from '@database/database.module';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { exampleUser, todo } from './__mocks__/todos.mocks';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [TodosController],
      providers: [TodosService, TodosRepository],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  describe('create', () => {
    it('should return todos', async () => {
      const todoInput: CreateTodoDto = {
        name: todo.name,
        completed: todo.completed,
        note: todo.note,
      };

      jest.spyOn(service, 'create').mockImplementationOnce(async () => todo);

      expect(await controller.create(todoInput, exampleUser)).toStrictEqual(
        todo,
      );
    });
  });

  describe('findAll', () => {
    it('should return todos', async () => {
      const paginatedResponse: Paginated<Todo> = {
        data: [todo],
        meta: { total: 1 },
      };
      jest
        .spyOn(service, 'findAll')
        .mockImplementationOnce(async () => paginatedResponse);

      expect(await controller.findAll(exampleUser, {})).toStrictEqual(
        paginatedResponse,
      );
    });
  });

  describe('findOne', () => {
    it('should return single todo', async () => {
      jest.spyOn(service, 'findOne').mockImplementationOnce(async () => todo);

      expect(await controller.findOne(todo.id, exampleUser)).toStrictEqual(
        todo,
      );
    });
  });

  describe('update', () => {
    it('should update single todo', async () => {
      const inputData: UpdateTodoDto = {
        name: 'new name',
        note: 'add note',
        completed: true,
      };

      const updatedTodo = { ...todo, ...inputData };

      jest
        .spyOn(service, 'update')
        .mockImplementationOnce(async () => updatedTodo);

      expect(
        await controller.update(todo.id, exampleUser, inputData),
      ).toStrictEqual(updatedTodo);
    });
  });

  describe('remove', () => {
    it('should delete single todo', async () => {
      jest.spyOn(service, 'remove').mockImplementationOnce(async () => 1);

      expect(await controller.remove(1, exampleUser)).toBe(1);
    });
  });
});
