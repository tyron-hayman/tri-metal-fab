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
