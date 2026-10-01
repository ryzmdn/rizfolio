export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I receive digital packages after checkout?",
    answer:
      "Digital assets are provisioned immediately upon successful transaction completion. You will be redirected to your dedicated Order Fulfillment Hub where you can download the full ZIP source archive, copy your license key, and view the quick-start installation guide. A backup receipt with permanent access tokens is also recorded.",
  },
  {
    id: "faq-2",
    question: "What is the difference between Standard and Extended licenses?",
    answer:
      "A Standard License permits you to use the codebase for one personal or commercial client project. An Extended Commercial License grants unlimited multi-project usage, commercial SaaS distribution, and rights to incorporate the architecture into monetized customer applications.",
  },
  {
    id: "faq-3",
    question:
      "Do I receive future updates when Next.js or Tailwind releases new versions?",
    answer:
      "Yes. All digital starter kits and UI systems include lifetime patches. Whenever upstream dependencies receive major upgrades (such as Next.js releases or Tailwind CSS improvements), revised archives are pushed to the repository and become accessible via your download token.",
  },
  {
    id: "faq-4",
    question: "How does the 1-on-1 Consultation Session work?",
    answer:
      "Upon booking a consultation package, you receive a direct scheduling link to pick a 60-minute or 90-minute time slot on Google Meet. Ahead of the session, we review your repository architecture, performance bottlenecks, or migration requirements to deliver targeted engineering guidance.",
  },
  {
    id: "faq-5",
    question:
      "Can I request a refund if the codebase does not match specifications?",
    answer:
      "We offer a 14-day quality guarantee. If you encounter a verified bug or architectural defect that cannot be resolved via our support team within 48 hours, you are eligible for full refund assistance.",
  },
]
