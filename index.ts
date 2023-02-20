function isDefined<T>(value: T | undefined): value is T {
  return !isUndefined(value);
}

function isNil(value: any): value is null | undefined {
  return value === null || isUndefined(value);
}

function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined' || value === undefined;
}

export function normalize<T>(value: T, to: null | undefined = undefined): T {
  if (isNil(value)) {
    return to as T;
  }

  if (typeof value === 'string') {
    if (value.trim().length === 0) {
      return to as T;
    }
    return value.trim() as unknown as T;
  }

  if (typeof value === 'object') {
    // in order to avoid the usage of the 'delete' keyword,
    // because of its time complexity, a map is instantiated
    // and afterwards is converted to object once again
    const map = new Map();
    Object.entries(value as any).forEach(([key, val]) => {
      const normalVal = normalize(val);
      if (isDefined(normalVal)) {
        map.set(key, normalVal);
      }
    });

    return Object.fromEntries(map);
  }

  return value;
}
