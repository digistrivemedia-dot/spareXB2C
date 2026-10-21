import type { FaqTopic, Policy, PolicyLink } from "@/features/content/types";
import { SUPPORT_EMAIL, SUPPORT_HOURS, SUPPORT_PHONE } from "@/lib/constants";
import { formatMobile } from "@/lib/format";

// Demo copy until the admin panel exists. Details still waiting on the client (return window,
// cash on delivery, pickup and drop) are worded so they don't promise anything specific.
const support = `${formatMobile(SUPPORT_PHONE)} or ${SUPPORT_EMAIL} (${SUPPORT_HOURS})`;

const faqTopics: FaqTopic[] = [
  {
    id: "orders",
    title: "Orders and delivery",
    faqs: [
      {
        id: "track-order",
        question: "How do I track my order?",
        answer:
          "Go to Orders in your account and open the order. You'll see each step, from Placed to Delivered, with the date it happened.\n\nOnce the order is shipped, the courier name and tracking number appear on the same page.",
      },
      {
        id: "delivery-time",
        question: "When will my order arrive?",
        answer:
          "Every product page shows a delivery date for your PIN code before you buy. Most orders in Bengaluru arrive in 2 to 3 working days.",
      },
      {
        id: "delivery-charge",
        question: "Is delivery free?",
        answer:
          "Delivery is free on orders of ₹499 or more. Below that, there is a ₹49 delivery charge, shown in your cart before you pay.",
      },
      {
        id: "cancel-order",
        question: "Can I cancel my order?",
        answer:
          "Yes, until it is shipped. Open the order and tap Cancel order. If you paid online, the money goes back to the same account.\n\nOnce an order is shipped it can't be cancelled, but you can return it after delivery.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns and refunds",
    faqs: [
      {
        id: "how-to-return",
        question: "How do I return a part?",
        answer:
          "Open the delivered order and tap Return items. Choose the parts, tell us why, and add a photo if something is damaged or wrong.\n\nWe check the request and let you know if it's approved. If it is, we collect the parts from your address.",
      },
      {
        id: "return-window",
        question: "How long do I have to return something?",
        answer:
          "The last day to return is shown on each delivered order. Unused parts in their original packing can be returned until then.",
      },
      {
        id: "refund-time",
        question: "When do I get my refund?",
        answer:
          "Once the parts reach us and pass a quick check, we refund you and send a credit note for your records. Online payments go back to the same account; your bank may take a few working days to show it.",
      },
    ],
  },
  {
    id: "fit",
    title: "Vehicles and fit",
    faqs: [
      {
        id: "how-fit-works",
        question: "How do I know a part fits my vehicle?",
        answer:
          "Choose your vehicle once (type, brand, model, variant and year). With a vehicle selected, the shop shows only the parts that fit it, and each product page says clearly whether it fits.",
      },
      {
        id: "vehicle-not-listed",
        question: "My vehicle isn't in the list. What can I do?",
        answer: `Send us an enquiry with your vehicle details and the part you need, and our team will help you find it. You can also call us on ${formatMobile(SUPPORT_PHONE)}.`,
      },
      {
        id: "wrong-part",
        question: "What if a part doesn't fit after all?",
        answer:
          "Don't fit it. Request a return from the order, and choose \"Doesn't fit my vehicle\" as the reason.",
      },
    ],
  },
  {
    id: "service",
    title: "Service bookings",
    faqs: [
      {
        id: "book-service",
        question: "How do I book a service?",
        answer:
          "Tap Book a service, choose your vehicle, the service you need, a garage and a date. Nothing is paid when you book.",
      },
      {
        id: "extra-work",
        question: "What if the garage finds extra work?",
        answer:
          "The garage sends you an estimate with each item and its price. You approve the items you want, or all of them, before any extra work starts.",
      },
      {
        id: "cancel-booking",
        question: "Can I cancel a booking?",
        answer:
          "Yes, at any time from your bookings. To change the date, cancel and book again, or call the garage.",
      },
      {
        id: "pay-service",
        question: "How do I pay for a service?",
        answer:
          "Pay online in the app once the work is done, or pay at the garage when you collect your vehicle. The bill is in the garage's name with its GST number.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments and invoices",
    faqs: [
      {
        id: "payment-methods",
        question: "How can I pay?",
        answer: "UPI, credit and debit cards, net banking and wallets. All prices include GST.",
      },
      {
        id: "gst-invoice",
        question: "Can I get a GST invoice for my business?",
        answer:
          'Yes. Add your GSTIN in Profile, or tick "Need a GST invoice?" at checkout. Your invoice is on the order page.',
      },
      {
        id: "payment-failed",
        question: "My payment failed but money was taken. What now?",
        answer:
          "A failed payment is usually returned to your account automatically within a few working days. If it doesn't show, contact us with the order number.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    faqs: [
      {
        id: "login",
        question: "How do I log in?",
        answer:
          "Enter your mobile number and the 6-digit code we send by SMS. There's no password to remember. A new number creates an account.",
      },
      {
        id: "change-number",
        question: "Can I change my mobile number?",
        answer: `Your number is your login, so it can't be changed in the app. Contact us on ${support} and we'll move your account.`,
      },
      {
        id: "other-devices",
        question: "I'm logged in on a phone I no longer use.",
        answer:
          "Open Devices in your account and log that phone out. It will need a new code to log in again.",
      },
    ],
  },
];

const updatedAt = "2026-10-01T10:00:00+05:30";

const policies: Policy[] = [
  {
    slug: "terms",
    title: "Terms of use",
    summary:
      "The rules for using the Kannali Garage website and app, buying parts from SpareX and booking services.",
    updatedAt,
    sections: [
      {
        id: "about",
        heading: "About these terms",
        paragraphs: [
          "These terms apply when you use the Kannali Garage website or app, buy parts from SpareX, or book a service with a garage through us. By using the site, you agree to them.",
        ],
      },
      {
        id: "account",
        heading: "Your account",
        paragraphs: [
          "You log in with your mobile number and a one-time code. Keep your phone safe, and log out of devices you no longer use from the Devices page.",
          "You're responsible for the vehicle details you add. Fit checks depend on them being correct.",
        ],
      },
      {
        id: "orders",
        heading: "Orders and prices",
        paragraphs: [
          "Prices include GST and are confirmed when you place the order. If a price or stock level changes before then, the order uses the current price.",
          "You can cancel an order until it is shipped. After delivery, returns follow our Returns and refunds policy.",
        ],
      },
      {
        id: "services",
        heading: "Service bookings",
        paragraphs: [
          "Services are carried out by the garage you choose, which bills you in its own name and GST number. Nothing is charged when you book.",
          "The garage asks for your approval before doing any work beyond what you booked. You can cancel a booking at any time.",
        ],
      },
      {
        id: "contact",
        heading: "Questions",
        paragraphs: [`Contact us on ${support}.`],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    summary: "What we collect about you, why, and the choices you have.",
    updatedAt,
    sections: [
      {
        id: "what",
        heading: "What we collect",
        paragraphs: [
          "Your name, mobile number and, if you add them, your email and GSTIN. Your addresses, vehicles, orders and service history. Basic information about the devices you log in from.",
        ],
      },
      {
        id: "why",
        heading: "Why we use it",
        paragraphs: [
          "To deliver your orders, check that parts fit your vehicle, arrange services with garages, send invoices and keep your account safe.",
          "We share only what's needed: your address with the courier, and your vehicle and booking with the garage you choose.",
        ],
      },
      {
        id: "choices",
        heading: "Your choices",
        paragraphs: [
          "You can change your profile, addresses and vehicles at any time in your account. To delete your account, contact us.",
        ],
      },
      {
        id: "contact",
        heading: "Questions",
        paragraphs: [`Contact us on ${support}.`],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping policy",
    summary: "Where we deliver, how long it takes and what it costs.",
    updatedAt,
    sections: [
      {
        id: "where",
        heading: "Where we deliver",
        paragraphs: [
          "Enter your PIN code on any product page to check delivery to your address and see the expected date.",
        ],
      },
      {
        id: "charges",
        heading: "Delivery charges",
        paragraphs: [
          "Delivery is free on orders of ₹499 or more. Smaller orders have a ₹49 delivery charge, shown in your cart.",
        ],
      },
      {
        id: "tracking",
        heading: "Tracking",
        paragraphs: [
          "Your order page shows every step. Once shipped, it also shows the courier and tracking number.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns and refunds",
    summary: "How to return a part and when you get your money back.",
    updatedAt,
    sections: [
      {
        id: "cancel",
        heading: "Cancelling an order",
        paragraphs: ["You can cancel an order from the order page until it is shipped."],
      },
      {
        id: "return",
        heading: "Returning a part",
        paragraphs: [
          "Request a return from the delivered order before the last return date shown on it. Choose the parts and the reason, and add photos if something arrived damaged or wrong.",
          "We review each request. If it's approved, we collect the parts from your address.",
        ],
      },
      {
        id: "refund",
        heading: "Refunds",
        paragraphs: [
          "Once the parts reach us and pass a check, we refund you and send a credit note. Online payments go back to the same account.",
        ],
      },
    ],
  },
];

export const mockContent = {
  async getFaqTopics(): Promise<FaqTopic[]> {
    return faqTopics;
  },

  async getPolicies(): Promise<PolicyLink[]> {
    return policies.map(({ slug, title }) => ({ slug, title }));
  },

  async getPolicy(slug: string): Promise<Policy | null> {
    return policies.find((p) => p.slug === slug) ?? null;
  },
};
