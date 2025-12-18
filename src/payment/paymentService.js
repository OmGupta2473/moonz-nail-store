import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";

export const createOrder = async (amount) => {
  const fn = httpsCallable(functions, "createOrder");
  return fn({ amount });
};
