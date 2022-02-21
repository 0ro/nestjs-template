import * as Joi from 'joi';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export type Schema = {
  NODE_ENV: NodeEnv;
  PORT: number;
  API_PREFIX: string;
  AWS: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
  };
  DB_URL: string;
  DB_NAME: string;
  MULTER: {
    fileSize: number;
  };
  SESSION_SECRET: string;
  REDIS: {
    host: string;
    port: number;
  };
};

// NOTE: extending Joi with custom validators for accepting environment variables as object
// see the stackoverflow answer: https://stackoverflow.com/a/70923498/13410760
const JoiCustom = Joi.extend({
  type: 'object',
  base: Joi.object(),
  coerce: {
    from: 'string',
    method(value) {
      if (value[0] !== '{' && !/^\s*{/.test(value)) {
        return {
          value,
        };
      }
      try {
        return { value: JSON.parse(value) };
      } catch (error) {
        return {
          errors: [error],
        };
      }
    },
  },
});

const schema = Joi.object<Schema, true>({
  NODE_ENV: Joi.string()
    .valid(NodeEnv.Development, NodeEnv.Production, NodeEnv.Test)
    .default(NodeEnv.Development),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  AWS: JoiCustom.object({
    accessKeyId: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    region: Joi.string().required(),
    bucket: Joi.string().required(),
  }).required(),
  DB_URL: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  MULTER: JoiCustom.object({
    fileSize: Joi.number().required(),
  }).default({
    fileSize: 10,
  }),
  SESSION_SECRET: Joi.string().required(),
  REDIS: JoiCustom.object({
    host: Joi.string().required(),
    port: Joi.number().required(),
  }).default({
    host: 'localhost',
    port: 6379,
  }),
});

export default schema;
