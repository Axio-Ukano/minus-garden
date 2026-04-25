export type DeepTranslation<T> = {
  [K in keyof T]: T[K] extends object ? DeepTranslation<T[K]> : string;
};
