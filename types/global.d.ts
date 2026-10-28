declare type UserProfile = {
  id: string;
  firstname: string;
  lastname: string;
  string: string;
  uid: string;
  role: "super_admin" | "user";
  active: boolean;
  image: string;
};

declare type TMFClients = {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  satus?: "active" | "unresponsive" | "inactive";
  company: string;
};

declare type TMFBuilds = {
  id?: number;
  buildID: string;
  created_at?: string;
  name: string;
  status: "scheduled" | "completed" | "in progress";
  clientList?: JSON;
  comments?: JSON;
  assets?: JSON;
};

declare type ClientStatus = "lead" | "active" | "inactive" | "archived";

declare type PreferredContact = "email" | "phone" | "mobile" | "text";

/** A row as returned from public.clients */
declare interface Client {
  id: string;
  user_id: string; // who created the record

  // Identity
  first_name: string;
  last_name: string;
  company_name: string | null;
  job_title: string | null;

  // Contact
  email: string | null;
  phone: string | null;
  mobile_phone: string | null;
  website: string | null;
  preferred_contact: PreferredContact | null;

  // Address
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country: string | null;

  // Billing
  billing_same_as_address: boolean;
  billing_address_line1: string | null;
  billing_address_line2: string | null;
  billing_city: string | null;
  billing_state_province: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  tax_id: string | null;
  payment_terms: string | null;

  // Relationship
  status: ClientStatus;
  source: string | null;
  date_of_birth: string | null; // "YYYY-MM-DD"
  tags: string[] | null;
  notes: string | null;

  // Timestamps (ISO 8601 strings)
  created_at: string;
  updated_at: string;
}

/** Fields you send when creating a client (DB fills in the rest) */
declare type ClientInsert = Pick<Client, "first_name" | "last_name"> &
  Partial<Omit<Client, "id" | "user_id" | "created_at" | "updated_at">>;

/** Fields you send when updating a client */
declare type ClientUpdate = Partial<ClientInsert>;
