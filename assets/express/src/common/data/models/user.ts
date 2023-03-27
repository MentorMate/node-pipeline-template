import { z } from 'zod';
import { email, password } from '../attributes';
import { id, timestamps, deletedAt } from '../attribute-sets';

export const userAttributes = z.object({
  email: email,
  password: password,
});

export type UserAttributes = z.infer<typeof userAttributes>;

export const user = userAttributes.merge(id).merge(timestamps).merge(deletedAt);

export type User = z.infer<typeof user>;
