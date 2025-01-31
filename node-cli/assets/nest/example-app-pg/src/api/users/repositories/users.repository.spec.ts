import { UsersRepository } from './users.repository';
import { Test } from '@nestjs/testing';
import { NestKnexService } from '@database/nest-knex.service';
import { Credentials } from '@api/auth/interfaces';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;

  const first = jest.fn(() => Promise.resolve({}));
  const returning = jest.fn().mockImplementation(() => Promise.resolve([]));

  const where = jest.fn().mockImplementation(() => ({
    first,
    update,
  }));

  const insert = jest.fn().mockImplementation(() => ({
    returning,
  }));

  const update = jest.fn().mockImplementation(() => ({
    returning,
  }));

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: NestKnexService,
          useFactory: () => ({
            connection: () => ({
              insert,
              where,
              update,
            }),
          }),
        },
        UsersRepository,
      ],
    }).compile();

    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  it('insertOne - create a user', async () => {
    const insertUser: Credentials = {
      email: 'user@example.com',
      password: 'password',
    };

    const createdUser = {
      id: '1',
      email: 'user@example.com',
      password: 'password',
    };

    returning.mockImplementationOnce(() => Promise.resolve([createdUser]));

    const result = await usersRepository.insertOne({
      email: insertUser.email,
      password: insertUser.password,
    });

    expect(result).toBe(createdUser);
    expect(insert).toHaveBeenCalledWith({
      id: expect.any(String),
      email: insertUser.email,
      password: insertUser.password,
    });
  });

  it('findByEmail - find a user', async () => {
    const userFound = {
      id: '1',
      email: 'user@example.com',
      password: 'password',
    };

    first.mockImplementationOnce(() => Promise.resolve(userFound));

    const result = await usersRepository.findByEmail('user@example.com');

    expect(result).toBe(userFound);
    expect(where).toHaveBeenCalledWith({ email: 'user@example.com' });
  });

  it('updateOne - modify a user', async () => {
    const updatedUser = {
      id: '1',
      email: 'user@example.com',
      password: 'new-password',
    };

    returning.mockImplementationOnce(() => Promise.resolve([updatedUser]));

    const result = await usersRepository.updateOne('1', {
      email: updatedUser.email,
      password: updatedUser.password,
    });

    expect(result).toBe(updatedUser);
    expect(where).toHaveBeenCalledWith({ id: '1' });
    expect(update).toHaveBeenCalledWith({
      email: updatedUser.email,
      password: updatedUser.password,
    });
  });
});
