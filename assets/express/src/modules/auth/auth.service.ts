import { UserRepository } from '@database';
import { definedOrNotFound, loggedInOrUnauthorized } from '@common';
import { JwtService, PasswordService } from '@modules';
import { AuthService } from './interfaces';

export const createAuthService = (
  users: UserRepository,
  jwtService: JwtService,
  passwordService: PasswordService
): AuthService => {
  const jwtConfig = jwtService.getConfig();

  return {
    async login({ email, password }) {
      const user = await users.find(email);

      if (user) {
        const validPassword = await passwordService.compareHash(
          password,
          user.password
        );
        const idToken = jwtService.sign({ email }, jwtConfig);

        if (validPassword) {
          return {
            idToken,
          };
        }
        loggedInOrUnauthorized('Invalid email or password');
      }
      definedOrNotFound('User not found');
    },
    async register({ email, password }) {
      const hashedPassword = await passwordService.hashPassword(password);

      const user = await users.create({
        email,
        password: hashedPassword,
      });

      if (user) {
        const idToken = jwtService.sign({ sub: user.id, email }, jwtConfig);
        return {
          idToken,
        };
      }
      definedOrNotFound('User not found');
    },
  };
};
