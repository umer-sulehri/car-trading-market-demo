import { GET } from "@/src/lib/api/get.service";
import { POST } from "@/src/lib/api/post.service";
import { PUT } from "@/src/lib/api/put.service";
import { DELETE } from "@/src/lib/api/delete.service";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const getAllUsers = async () => {
  const res = await GET<any>("/admin/users");
  return Array.isArray(res) ? res : (res?.data ?? []);
};

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  return POST("/admin/users", data);
};

export const updateUser = (
  id: number,
  data: Partial<{ name: string; email: string; role: string }>
) => {
  return PUT(`/admin/users/${id}`, data);
};

export const deleteUser = (id: number) => {
  return DELETE(`/admin/users/${id}`);
};
