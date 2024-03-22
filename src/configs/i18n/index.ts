import i18n from 'i18next';
import { join } from 'path';
import FsBackend from 'i18next-fs-backend';
import i18nextMiddleware, { LanguageDetector } from 'i18next-http-middleware';

i18n
  .use(FsBackend)
  .use(LanguageDetector)
  .init({
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'en',
    backend: {
      loadPath: join(__dirname, './locales/{{lng}}.json'),
    },
    preload: ['en'],
  });

const i18nMiddleware = i18nextMiddleware.handle(i18n);

export default i18nMiddleware;
