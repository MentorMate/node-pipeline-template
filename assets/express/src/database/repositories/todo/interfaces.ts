import { z, ZodEnum } from 'zod';
import { FilterMap, SorterMap } from '@database';
import { Knex as KnexType } from 'knex';
import { Tables } from 'knex/types/tables';
import { sortOrder, pagination } from '../../utils';

//
// List To-Dos inputs
//
const listTodosFilters = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
});

type ListTodosFilters = z.infer<typeof listTodosFilters>;

export const listTodosFilterMap: FilterMap<
  KnexType.QueryBuilder<Tables['todos']>,
  ListTodosFilters
> = {
  id: (qb, id) => qb.where({ id }),
  name: (qb, name) => qb.whereILike('name', `%${name}%`),
};

const listTodosSortColumn = z.enum(['name', 'createdAt']);
const sorts = <S extends ZodEnum<[string, ...string[]]>>(schema: S) =>
  z.array(
    z.object({
      column: schema,
      order: sortOrder.optional(),
    })
  );
const listTodosSorts = sorts(listTodosSortColumn);

export type ListTodosSortColumn = z.infer<typeof listTodosSortColumn>;

const listTodosSorterMap: SorterMap<
  KnexType.QueryBuilder<Tables['todos']>,
  ListTodosSortColumn
> = {
  name: (qb, order) => qb.orderBy('name', order),
  createdAt: (qb, order) => qb.orderBy('createdAt', order),
};

export const listTodosMaps = {
  filterMap: listTodosFilterMap,
  sorterMap: listTodosSorterMap,
};

export const listTodosQuery = z.object({
  filters: listTodosFilters.optional(),
  sorts: listTodosSorts.optional(),
  pagination: pagination.optional(),
});

export type ListTodosQuery = z.infer<typeof listTodosQuery>;
