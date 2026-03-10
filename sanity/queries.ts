// ── Login Page ───────────────────────────────────────────────────────────────

export const loginPageQuery = `
  *[_type == "loginPage" && _id == "loginPage"][0] {
    heading,
    subheading,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type LoginPageQueryResult = {
  heading: string | null;
  subheading: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};

// ── Dashboard Page ───────────────────────────────────────────────────────────

export const dashboardPageQuery = `
  *[_type == "dashboardPage" && _id == "dashboardPage"][0] {
    heading,
    welcomeMessage,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type DashboardPageQueryResult = {
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
    heading,
    description,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type SettingsPageQueryResult = {
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
    heading,
    description,
    seo {
      metaTitle,
      metaDescription
    }
  }
`;

export type ClientsPageQueryResult = {
  heading: string | null;
  description: string | null;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
};
