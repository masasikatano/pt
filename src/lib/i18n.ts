import messages from '@/messages/ja.json';

function getValue(obj: any, key: string): any {
  return key.split('.').reduce((o, k) => o?.[k], obj);
}

export function t(key: string, params?: Record<string, string | number>): string {
  const value = getValue(messages, key);
  if (typeof value !== 'string') {
    console.warn(`[i18n] Missing translation key: ${key}`);
    return key;
  }
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => {
    const v = params[k];
    return v !== undefined ? String(v) : `{${k}}`;
  });
}

export function tRaw(key: string): any {
  return getValue(messages, key);
}

export function tHas(key: string): boolean {
  const value = getValue(messages, key);
  return value !== undefined;
}

export default { t, tRaw, tHas };
