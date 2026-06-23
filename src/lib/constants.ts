export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pt.p12r.workers.dev';
export const SITE_NAME = 'ProductTrapper';

export function pageTitle(pageName: string): string {
  return `${pageName} | ${SITE_NAME}`;
}
