import { HttpStatusCode } from '@util/status_codes';
import { KeyObject } from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

import { V2 as pasetoV2 } from 'paseto';
// define options
export interface PasetowareOptions {
  key: KeyObject;
}

export const pasetoware = function (options: PasetowareOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    let hasError = false;
    try {
      const token = request.headers.authorization ?? '';
      const payload = await pasetoV2.verify(token, options.key);
      hasError = payload == null;
    } catch (err) {
      console.error(err);
      hasError = true;
    }
    if (hasError) {
      return reply.status(HttpStatusCode.Forbidden).send('Access Denied');
    }
  };
};
