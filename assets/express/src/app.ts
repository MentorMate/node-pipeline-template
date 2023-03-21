import express, { json } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pino from 'pino';

import { createClient } from './database/initilize-knex';
import { createTodoRepository, createUserRepository } from '@database';
import {
  routes,
  errorHandler,
  handleServiceError,
  logRequest,
  validateRequest,
  attachServices,
  validateAccessToken,
} from '@api';
import { Environment } from '@common/environment';
import { createTokensService, createAuthService, Services } from './modules';
import { createTodoService, createUserService } from './modules';

export function create(env: Environment) {
  // create a logger
  const logger = pino({
    name: 'http',
    ...(env.NODE_ENV !== 'production' && {
      transport: {
        target: 'pino-pretty',
        colorize: false,
      },
    }),
  });

  // create services
  const knex = createClient(logger);
  const todoRepository = createTodoRepository(knex);
  const userRepository = createUserRepository(knex);
  const tokensService = createTokensService(env);
  const authService = createAuthService(userRepository, tokensService);
  const todoService = createTodoService(todoRepository);
  const userService = createUserService(userRepository);
  const services: Services = { userService, todoService, authService };

  // create the app
  const app = express();

  // register global middleware
  app.use(
    // logs the request verb and url
    logRequest(logger),
    // add security HTTP headers
    helmet(),
    // enables CORS
    cors(/* TODO: configure origins */),
    // parses the body of application/json requests
    json(),
    // compresses response bodies
    compression(),
    // makes the services available to the route handlers by attaching them to the request
    attachServices(services),
    // JWT authentication
    validateAccessToken(tokensService),
  );

  // register routes
  for (const { method, path, request, middlewares = [], handler } of routes) {
    if (request) {
      middlewares.push(validateRequest(request));
    }

    app[method](path, ...middlewares, handler);
  }

  // register error handlers
  app.use(handleServiceError());
  app.use(errorHandler(logger));

  // define an app tear down function
  const destroy = async () => {
    await knex.destroy();
  };

  return { app, destroy };
}
