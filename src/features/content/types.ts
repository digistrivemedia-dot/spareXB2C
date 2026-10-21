export type Faq = {
  id: string;
  question: string;
  /** Plain text; a blank line starts a new paragraph. */
  answer: string;
};

/** A group of questions on the help page, e.g. "Orders and delivery". */
export type FaqTopic = {
  id: string;
  title: string;
  faqs: Faq[];
};

export type PolicySlug = "terms" | "privacy" | "shipping" | "returns";

export type PolicySection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

/** A policy page as written in the admin panel. */
export type Policy = {
  slug: PolicySlug;
  title: string;
  /** One or two sentences shown under the title. */
  summary: string;
  updatedAt: string;
  sections: PolicySection[];
};

export type PolicyLink = Pick<Policy, "slug" | "title">;
