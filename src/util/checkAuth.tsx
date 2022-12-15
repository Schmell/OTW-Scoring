import { getAuth } from "firebase/auth";

export function checkAuth(user) {
  if (!user) {
    const auth = getAuth();
    return auth.currentUser;
  }
  return user;
}
