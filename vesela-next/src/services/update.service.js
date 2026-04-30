import { post } from "@/lib/apiService";

export const updateUserInfo = (data) => post("/api/update_user_info/", data);
