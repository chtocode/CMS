import { isObject } from 'lodash';

const apiKeyMap = new Map([
  ['createdAt', 'ctime'],
  ['updatedAt', 'updateAt'],
]);

export const rename = (target: any) => {
  if (isObject(target)) {
    const keys = Object.keys(target);

    keys.forEach((key) => {
      const newKey = apiKeyMap.get(key);

      target[newKey || key] = rename(target[key]);

      if (newKey) {
        delete target[key];
      }
    });
  }

  return target;
};

export const fieldMap = (obj = apiKeyMap) => (target, name, descriptor) => {
  const oldValue = descriptor.value;

  descriptor.value = function () {
    return oldValue.apply(this, arguments).then((res) => {
      const { data, ...others } = res;

      return { data: rename(data), ...others };
    });
  };

  return descriptor;
};
