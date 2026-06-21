import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export async function testFirestore() {
  try {
    await addDoc(
      collection(db, "test"),
      {
        message: "Firebase Connected Successfully",
        createdAt: new Date()
      }
    );

    console.log("Firebase Connected!");
  } catch (error) {
    console.error("Firestore Error:", error);
  }
}