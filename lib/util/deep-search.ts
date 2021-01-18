export type PredicateFn<T> = (data: T, value: any) => boolean;

/**
 * ? unused just for recursion
 * 生成深度优先搜索函数
 * @param predicateFn - 节点判定函数
 * @param value - 搜索的值
 * @param key - 向下递归的key
 */
export const deepSearchFactory = <T>(predicateFn: PredicateFn<T>, value: any, key: string) => {
  return function deepSearch(data: T[]): T {
    const headNode = data.slice(0, 1)[0]; // 一个更小的范围
    const restNodes = data.slice(1); // 缩减搜索条件

    if (headNode) {
      // 当前节点已经被判定为符合指定条件的值，直接返回
      if (predicateFn(headNode, value)) {
        return headNode;
      }

      // 当前节点上还有子节点，优先在子节点上进行搜索，
      if (headNode[key]) {
        const res = deepSearch(headNode[key]);

        if (res) {
          return res; // 搜索到符合条件的值，返回
        }
      }
    }

    // 继续在剩下的节点中进行搜索
    if (restNodes.length) {
      const res = deepSearch(restNodes);

      if (res) {
        return res; // 搜索到符合条件的值，返回
      }
    }

    return null; // 遍历完成后没有找到返回null
  };
};

export const deepSearchRecordFactory = <T>(
  predicateFn: PredicateFn<T>,
  value: any,
  key: string
) => {
  return function search(data: T[], record = []): number[] {
    const headNode = data.slice(0, 1)[0];
    const restNodes = data.slice(1);

    record.push(-restNodes.length - 1); // 节点位置入栈

    if (predicateFn(headNode, value)) {
      return record;
    }

    if (headNode[key]) {
      const res = search(headNode[key], record);

      if (res) {
        return record;
      } else {
        record.pop(); // 节点出栈
      }
    }

    if (restNodes.length) {
      record.pop(); // 节点出栈

      const res = search(restNodes, record);

      if (res) {
        return record;
      }
    }

    return null;
  };
};
