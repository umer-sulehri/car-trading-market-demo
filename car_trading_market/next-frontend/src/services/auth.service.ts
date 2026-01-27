
import { API } from "@/src/lib/api/endpoints";
import { POST } from "../lib/api/post.service";


export const login = async (data: {
  email: string;
  password: string;
}) => {
  
  const res:any = await POST(API.auth.login, data);
  console.log("API.auth.login: ", API.auth.login, res);
  
  return res;
};


export const signup = async (data: any) => {
  
  const res:any = await POST(API.auth.signup, data);
  console.log("API.auth.signup: ", API.auth.signup, res);
  
  return res;
};

export const logoutService = async () => {
  return POST(API.auth.logout, {});
};
