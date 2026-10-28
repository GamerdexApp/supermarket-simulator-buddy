export const landingText = {
  header: {
    label: "Landing page",
    features: "Features",
    faq: "FAQ",
    github: "GitHub",
    discord: "Discord",
  },
  cta: {
    create: "Create your first playthrough",
    dashboard: "Go to dashboard",
    newPlaythrough: "New playthrough",
    learn: "Learn more",
  },
  hero: {
    titleStart: "Track Your Supermarket ",
    titleEnd: "Empire",
    body: "The ultimate companion app for Supermarket Simulator. Manage multiple playthroughs, track your progress, and build your supermarket empire with confidence.",
    preview:
      "Overview of Pezz's Market showing total spending, store progress and active loans",
  },
  continueCard: {
    label: "Continue",
    level: (level: number) => `Store level ${level}`,
    updated: (date: string) => `Last updated ${date}`,
  },
  steps: {
    title: "Start in a minute",
    items: [
      {
        title: "Create a playthrough",
        body: "Give it a name. Everything is saved in this browser, with no account.",
      },
      {
        title: "Start with the basics",
        body: "Every playthrough begins with License 0, growth section 1 and the Paper Bag, Sponge and Mop.",
      },
      {
        title: "Unlock as you play",
        body: "Raise your store level, then unlock licenses, sections, staff, tools and vehicles as you do in the game.",
      },
    ],
  },
  features: {
    eyebrow: "Everything you need",
    title: "All your progress in one place",
    body: "Supermarket Simulator Buddy provides comprehensive tracking for every aspect of your supermarket business. From licenses to storage, we've got you covered.",
    items: [
      {
        title: "Multiple Playthroughs",
        body: "Create and manage unlimited playthroughs. Track different strategies and challenge runs separately.",
      },
      {
        title: "License Management",
        body: "Track all your product licenses and see what items each license unlocks for your store.",
      },
      {
        title: "Store Growth",
        body: "Monitor your store expansion with detailed tracking of storage and growth sections.",
      },
      {
        title: "Budget Tracking",
        body: "Keep tabs on your spending across all categories with comprehensive financial summaries.",
      },
      {
        title: "Shopping Lists",
        body: "Create custom shopping lists to know what to get at each store.",
      },
      {
        title: "Data Export/Import",
        body: "Export your progress as JSON for backup or share with friends. Import data anytime.",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What is Supermarket Simulator Buddy?",
        answer:
          "Supermarket Simulator Buddy is a comprehensive progress tracking tool for the game Supermarket Simulator. It helps you manage multiple playthroughs, track your store growth, manage licenses, and monitor your financial progress all in one place.",
      },
      {
        question: "How does it store my data?",
        answer:
          "All your data is stored locally in your browser using localStorage. This means your progress is private and doesn't require any server or account creation. You can also export and import your data as JSON files for backup or sharing.",
      },
      {
        question: "Can I track multiple playthroughs?",
        answer:
          "Yes! You can create and manage multiple playthroughs, each with its own progress tracking. Switch between them easily using the sidebar dropdown and track different strategies or challenge runs separately.",
      },
      {
        question: "What features can I track?",
        answer:
          "Track your store level, licenses, storage sections, growth areas, tools, vehicles, and shopping lists, and browse furniture and paint prices. Monitor your financial progress with detailed budget tracking across all categories.",
      },
      {
        question: "Is this app free to use?",
        answer:
          "Yes, Supermarket Simulator Buddy is completely free to use. There are no subscriptions, no ads, and no hidden costs. All features are available to everyone.",
      },
    ],
  },
  closing: {
    title: "Ready to run your store?",
    body: "Free, private and saved in your browser.",
  },
} as const;
