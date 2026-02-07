import { API } from "@/src/lib/api/endpoints";
import { GET } from "@/src/lib/api/get.service";
import { PUT } from "@/src/lib/api/put.service";

export interface AppUser {
  id: number;
  name: string;
  email: string;
  profile?: string | null;
  created_at?: string;
}

export const getUserProfile = () => {
  return GET<AppUser>(API.user.profile);
};

export const updateUserProfile = (data: {
  name: string;
  email: string;
}) => {
  return PUT<AppUser>(API.user.profile, data);
};
