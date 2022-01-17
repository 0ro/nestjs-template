import * as Joi from 'joi';

export type Schema = {
  NODE_ENV: string;
  PORT: number;
  AWS: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
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
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  AWS: JoiCustom.object({
    accessKeyId: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    region: Joi.string().required(),
    bucket: Joi.string().required(),
  }).required(),
});

export default schema;
