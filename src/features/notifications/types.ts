/** One line in the header's notifications list. */
export type Notification = {
  id: string;
  title: string;
  detail: string;
  href: string;
  /** The customer has to do something (approve, pay), not just news. */
  needsAction: boolean;
};
