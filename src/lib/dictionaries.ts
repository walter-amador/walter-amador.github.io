import 'server-only';
import type { Locale } from '@root/i18n.config';

export type LangsTypes = 'en' | 'es' | 'fr';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
