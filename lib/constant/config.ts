import { Gutter } from 'antd/lib/grid/row';

const typeTemplate = "'${name}' is not a valid ${type}";

export const validateMessages = {
  default: "Validation error on field '${name}'",
  required: "'${name}' is required",
  enum: "'${name}' must be one of [${enum}]",
  whitespace: "'${name}' cannot be empty",
  date: {
    format: "'${name}' is invalid for format date",
    parse: "'${name}' could not be parsed as date",
    invalid: "'${name}' is invalid date",
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    len: "'${name}' must be exactly ${len} characters",
    min: "'${name}' must be at least ${min} characters",
    max: "'${name}' cannot be longer than ${max} characters",
    range: "'${name}' must be between ${min} and ${max} characters",
  },
  number: {
    len: "'${name}' must equal ${len}",
    min: "'${name}' cannot be less than ${min}",
    max: "'${name}' cannot be greater than ${max}",
    range: "'${name}' must be between ${min} and ${max}",
  },
  array: {
    len: "'${name}' must be exactly ${len} in length",
    min: "'${name}' cannot be less than ${min} in length",
    max: "'${name}' cannot be greater than ${max} in length",
    range: "'${name}' must be between ${min} and ${max} in length",
  },
  pattern: {
    mismatch: "'${name}' format is invalid",
  },
};

export const gutter: [Gutter, Gutter] = [6, 16];

export const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export enum Gender {
  'Male' = 1,
  'Female',
}

export enum SkillDes {
  'Know' = 1,
  'Practiced',
  'Comprehend',
  'Expert',
  'Master',
}

export const skillDes = new Array(5).fill(0).map((_, index) => SkillDes[index + 1]);

export const programLanguageColors: string[] = [
  'magenta',
  'volcano',
  'orange',
  'gold',
  'green',
  'cyan',
  'geekblue',
  'purple',
  'red',
  'lime',
];
