<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Resep Masakan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="container">
        <!-- Tombol Tambah Resep -->
        <ion-button expand="block" @click="openModal('add')">Tambah Resep</ion-button>

        <!-- Daftar Resep -->
        <ion-list>
          <ion-item v-for="recipe in recipes" :key="recipe.id">
            <ion-label>
              <h2>{{ recipe.nama }}</h2>
              <p>{{ recipe.langkah.join(', ') }}</p>
            </ion-label>
            <ion-button slot="end" @click="openModal('edit', recipe)">Edit</ion-button>
            <ion-button slot="end" color="danger" @click="deleteRecipe(recipe.id)">Hapus</ion-button>
          </ion-item>
        </ion-list>

        <!-- Modal -->
        <ion-modal :is-open="isModalOpen" @didDismiss="closeModal" cssClass="custom-modal">
          <div class="modal-content">
            <ion-header>
              <ion-toolbar>
                <ion-title>{{ modalMode === 'add' ? 'Tambah Resep' : 'Edit Resep' }}</ion-title>
                <ion-buttons slot="end">
                  <ion-button @click="closeModal">Close</ion-button>
                </ion-buttons>
              </ion-toolbar>
            </ion-header>
            <ion-content>
              <form @submit.prevent="modalMode === 'add' ? addRecipe() : updateRecipe()">
                <ion-item>
                  <ion-label position="stacked">Nama Resep</ion-label>
                  <ion-input v-model="modalRecipe.nama" placeholder="Masukkan nama resep"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="stacked">Langkah-Langkah</ion-label>
                  <ion-textarea
                    v-model="modalRecipe.langkah"
                    placeholder="Langkah memasak, pisahkan dengan koma"
                    auto-grow="true"
                    rows="6" 
                    style="min-height: 150px;"
                  ></ion-textarea>
                </ion-item>
                <ion-button expand="block" type="submit">{{ modalMode === 'add' ? 'Tambah' : 'Simpan' }}</ion-button>
              </form>
            </ion-content>
          </div>
        </ion-modal>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonList,
  IonModal,
} from "@ionic/vue";
import { firestoreService } from "@/utils/firestore";
import { Recipe } from "@/utils/firestore";

const recipes = ref<Recipe[]>([]);
const modalRecipe = ref<Partial<Recipe>>({
  nama: "",
  langkah: [],
});
const isModalOpen = ref(false);
const modalMode = ref<"add" | "edit">("add");

// Fetch recipes saat komponen dimuat
onMounted(async () => {
  await fetchRecipes();
});

// Fungsi untuk mendapatkan daftar resep
async function fetchRecipes() {
  try {
    recipes.value = await firestoreService.getRecipes();
  } catch (error) {
    console.error("Gagal memuat resep:", error);
  }
}

// Fungsi untuk membuka modal
function openModal(mode: "add" | "edit", recipe?: Recipe) {
  modalMode.value = mode;
  if (mode === "edit" && recipe) {
    modalRecipe.value = { ...recipe, langkah: recipe.langkah.join(", ") };
  } else {
    modalRecipe.value = { nama: "", langkah: "" };
  }
  isModalOpen.value = true;
}

// Fungsi untuk menutup modal
function closeModal() {
  isModalOpen.value = false;
}

// Fungsi untuk menambahkan resep baru
async function addRecipe() {
  if (!modalRecipe.value.nama || !modalRecipe.value.langkah) {
    alert("Nama resep dan langkah-langkah wajib diisi.");
    return;
  }

  try {
    const langkahArray = modalRecipe.value.langkah.split(",").map((item) => item.trim());
    await firestoreService.addRecipe({
      nama: modalRecipe.value.nama,
      langkah: langkahArray,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    closeModal();
    await fetchRecipes();
  } catch (error) {
    console.error("Gagal menambahkan resep:", error);
  }
}

// Fungsi untuk memperbarui resep
async function updateRecipe() {
  if (!modalRecipe.value.nama || !modalRecipe.value.langkah || !modalRecipe.value.id) {
    alert("Nama resep dan langkah-langkah wajib diisi.");
    return;
  }

  try {
    const langkahArray = modalRecipe.value.langkah.split(",").map((item) => item.trim());
    await firestoreService.updateRecipe(modalRecipe.value.id, {
      nama: modalRecipe.value.nama,
      langkah: langkahArray,
    });
    closeModal();
    await fetchRecipes();
  } catch (error) {
    console.error("Gagal memperbarui resep:", error);
  }
}

// Fungsi untuk menghapus resep
async function deleteRecipe(id: string) {
  try {
    await firestoreService.deleteRecipe(id);
    await fetchRecipes();
  } catch (error) {
    console.error("Gagal menghapus resep:", error);
  }
}
</script>

<style scoped>
.container {
  padding: 16px;
}

ion-item {
  margin-bottom: 16px;
}

.custom-modal {
  --width: 90%; /* Lebar modal */
  --height: 80%; /* Tinggi modal */
  --border-radius: 12px; /* Tepi modal */
}

.modal-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  height: 100%; /* Pastikan konten memenuhi modal */
  box-sizing: border-box;
}

ion-content {
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>
