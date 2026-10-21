/** The shape every list endpoint returns. `page` is 1-based. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

/** What a server action returns: success, or a message the form can show. */
export type ActionResult = { ok: true } | { ok: false; message: string };

/** A photo anywhere on the site: a vehicle, a return, an inspection at the garage. */
export type Photo = {
  url: string;
  alt: string;
};
