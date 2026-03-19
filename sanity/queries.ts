// ── Login Page ───────────────────────────────────────────────────────────────

export const loginPageQuery = `
  *[_type == "loginPage" && _id == "loginPage"][0] {
  maintenanceMode,
    heading,
    subheading,
    formDisclaimer,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type LoginPageQueryResult = {
  maintenanceMode: boolean;
  heading: string | null;
  subheading: string | null;
  formDisclaimer: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};

// ── Dashboard Page ───────────────────────────────────────────────────────────

export const dashboardPageQuery = `
  *[_type == "dashboardPage" && _id == "dashboardPage"][0] {
  maintenanceMode,
    heading,
    welcomeMessage,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type DashboardPageQueryResult = {
  maintenanceMode: boolean;
  heading: string | null;
  welcomeMessage: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};

// ── Settings Page ────────────────────────────────────────────────────────────

export const settingsPageQuery = `
  *[_type == "settingsPage" && _id == "settingsPage"][0] {
  maintenanceMode,
    heading,
    description,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type SettingsPageQueryResult = {
  maintenanceMode: boolean;
  heading: string | null;
  description: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};

// ── Profile / Account Page ───────────────────────────────────────────────────

export const profilePageQuery = `
  *[_type == "profilePage" && _id == "profilePage"][0] {
  maintenanceMode,
    heading,
    description,
    formFooterContent,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type ProfilePageQueryResult = {
  maintenanceMode: boolean;
  heading: string | null;
  description: string | null;
  formFooterContent: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};

// ── Clients Page ───────────────────────────────────────────────────

export const clientsPageQuery = `
  *[_type == "clientsPage" && _id == "clientsPage"][0] {
  maintenanceMode,
    heading,
    description,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type ClientsPageQueryResult = {
  maintenanceMode: boolean;
  heading: string | null;
  description: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};

// ── Builds Page ───────────────────────────────────────────────────

export const BuildsPageQuery = `
  *[_type == "buildPage" && _id == "buildPage"][0] {
  maintenanceMode,
    heading,
    description,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type BuildsPageQueryResult = {
  maintenanceMode: boolean;
  heading: string | null;
  description: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};
