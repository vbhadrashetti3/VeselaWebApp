import { post } from "@/lib/apiService";

export const loginUser = (data) => post("/dj-rest-auth/login/", data);
export const registerUser = (data) => post("/dj-rest-auth/registration/", data);
