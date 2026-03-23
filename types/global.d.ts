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
