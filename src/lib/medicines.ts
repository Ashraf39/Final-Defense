import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Medicine } from "@/types/medicine";

export const toggleLike = async (userId: string, medicineId: string) => {
  const likeRef = doc(db, "likes", `${userId}_${medicineId}`);
  const likeDoc = await getDoc(likeRef);

  if (likeDoc.exists()) {
    await deleteDoc(likeRef);
    return false;
  } else {
    await setDoc(likeRef, {
      userId,
      medicineId,
      createdAt: new Date(),
    });
    return true;
  }
};

export const addToCart = async (userId: string, medicine: Medicine) => {
  const cartItemRef = doc(db, "cartItems", `${userId}_${medicine.id}`);
  const cartItemDoc = await getDoc(cartItemRef);

  if (!cartItemDoc.exists()) {
    await setDoc(cartItemRef, {
      userId,
      medicineId: medicine.id,
      quantity: 1,
      price: medicine.price,
      name: medicine.name,
      image: medicine.image,
      createdAt: new Date(),
    });
  }
};

export const getLikedMedicines = async (userId: string): Promise<Medicine[]> => {
  const likesQuery = query(collection(db, "likes"), where("userId", "==", userId));
  const likesSnapshot = await getDocs(likesQuery);
  
  const medicines: Medicine[] = [];
  for (const likeDoc of likesSnapshot.docs) {
    const medicineId = likeDoc.data().medicineId;
    const medicineDoc = await getDoc(doc(db, "medicines", medicineId));
    if (medicineDoc.exists()) {
      medicines.push({ id: medicineDoc.id, ...medicineDoc.data() } as Medicine);
    }
  }
  
  return medicines;
};

export const isLiked = async (userId: string, medicineId: string): Promise<boolean> => {
  const likeRef = doc(db, "likes", `${userId}_${medicineId}`);
  const likeDoc = await getDoc(likeRef);
  return likeDoc.exists();
};