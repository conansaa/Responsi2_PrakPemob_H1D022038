// src/utils/firestore.ts
import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// interface data
export interface Recipe {
    id?: string;
    nama: string; // Nama resep
    langkah: string[]; // Langkah-langkah cara memasak
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// operasi CRUD
export const firestoreService = {
    // get collection ref
    getRecipeRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'recipes');
    },

    // create
    async addRecipe(recipe: Omit<Recipe, 'id'>) {
        try {
            const recipeRef = this.getRecipeRef();
            const docRef = await addDoc(recipeRef, {
                ...recipe,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Resep:', error);
            throw error;
        }
    },

    // read
    async getRecipes(): Promise<Recipe[]> {
        try {
            const recipeRef = this.getRecipeRef();
            const q = query(recipeRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Recipe));
        } catch (error) {
            console.error('Error Get Recipes:', error);
            throw error;
        }
    },

    // update
    async updateRecipe(id: string, recipe: Partial<Recipe>) {
        try {
            const recipeRef = this.getRecipeRef();
            const docRef = doc(recipeRef, id);
            await updateDoc(docRef, {
                ...recipe,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Recipe:', error);
            throw error;
        }
    },

    // delete
    async deleteRecipe(id: string) {
        try {
            const recipeRef = this.getRecipeRef();
            const docRef = doc(recipeRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Recipe:', error);
            throw error;
        }
    }
};
