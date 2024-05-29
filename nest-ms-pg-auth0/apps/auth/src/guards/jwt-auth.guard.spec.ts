import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('Auth Guard', () => {
  let authGuard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [JwtAuthGuard, Reflector],
    }).compile();

    authGuard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if route is public', () => {
      reflector.getAllAndOverride = jest.fn().mockReturnValue(true);
      const mockContext = createMock<ExecutionContext>();
      expect(authGuard.canActivate(mockContext)).toBe(true);
    });

    it("should call the super's object `canActivate` method", () => {
      reflector.getAllAndOverride = jest.fn().mockReturnValue(false);
      const superObj = Object.getPrototypeOf(Object.getPrototypeOf(authGuard));
      superObj.canActivate = jest.fn().mockReturnValue(true);

      const mockContext = createMock<ExecutionContext>();
      const result = authGuard.canActivate(mockContext);

      expect(superObj.canActivate).toHaveBeenCalledTimes(1);
      expect(superObj.canActivate).toHaveBeenCalledWith(mockContext);
      expect(result).toBe(true);
    });
  });
});
