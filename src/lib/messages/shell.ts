export const shellText = {
  skipToContent: "Skip to content",
  closeMenu: "Close menu",
  openMenu: "Open menu",
  menuLabel: "Site menu",
  mainNav: "Main",
  brandWords: ["Supermarket", "Simulator", "Buddy"],
  noPlaythroughHint: "Create a playthrough to start tracking.",
  switcher: {
    sectionLabel: "Playthrough",
    loading: "Loading",
    none: "None selected",
    switch: "Switch playthrough",
    playthroughs: "Playthroughs",
    active: "Active",
    all: "All playthroughs",
    create: "New playthrough",
    storeLevel: (level: number) => `Store level ${level}`,
  },
  storeLevel: {
    label: "Store level",
  },
  empty: {
    title: "No playthrough selected",
    description:
      "Create a playthrough or pick one from your list to see this page.",
    create: "New playthrough",
    all: "All playthroughs",
  },
  footer: {
    tagline:
      "A free progress tracker for Supermarket Simulator. Your data stays in your browser, or in your own cloud storage if you turn on sync.",
    support: "Support",
    about: "About",
    settings: "Settings",
    discord: "Discord",
    github: "GitHub",
    officialGame: "Official game",
    privacy: "Privacy policy",
    terms: "Terms of service",
    disclaimerTitle: "Disclaimer",
    disclaimer:
      "This project is not affiliated with, endorsed by, or connected to Supermarket Simulator or its developers. All trademarks and game content belong to their owners.",
    framework:
      "Built with the Gamerdex framework, a shared base for free game progress trackers.",
    visitGamerdex: "Visit Gamerdex",
  },
  notFound: {
    title: "Page not found",
    body: "That page does not exist or has moved.",
    toOverview: "Go to Overview",
    toHome: "Go home",
  },
} as const;

export const saveFailedText = {
  title: "Not saved",
  message:
    "The browser could not store your changes. Download a backup so nothing is lost.",
  exportBackup: "Download backup",
} as const;
