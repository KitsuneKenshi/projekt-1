<template>
    <div>
        <v-card-title>
            <h1 class="text-h5">Ankiety</h1>
        </v-card-title>
        <v-btn block to="/panel/edit" color="primary">Dodaj Ankietę <v-icon right>mdi-database-plus</v-icon></v-btn>
        <v-card-text>
            <v-data-table v-model:headers="headers" :items="forms" :items-length="totalItems"
                :items-per-page="itemsPrepage">
                <template #item.actions="{ item }">
                    <div class="d-flex">
                        <v-btn class="mr-1" size="x-small" :to="'/panel/edit/' + item.value" color="primary" icon><v-icon
                                right>mdi-pencil</v-icon></v-btn>
                        <v-btn size="x-small" @click="" color="error" icon><v-icon right>mdi-delete</v-icon>
                            <v-dialog v-model="dialog" activator="parent" width="auto">
                                <v-card>
                                    <v-card-text>
                                        Czy na pewno chcesz usunąć ankietę?
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn color="error" block @click="deleteForm(item.value)">Usuń</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </div>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';
import { useFirebaseUser } from '~/stores/firebase';

const dialog = ref(false);
const itemsPrepage = ref(10)
const totalItems = ref(0);
const forms = ref<{
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string
}[]>([]);
const headers = ref([
    {
        title: 'Tytuł',
        key: 'name',
        align: "start",
    },
    {
        title: 'Data utworzenia',
        key: 'createdAt',
        align: "end",
    },
    {
        title: 'Data modyfikacji',
        key: 'updatedAt',
        align: "end",
    },
    {
        title: 'Akcje',
        key: 'actions',
        align: "end",
        sortable: false,
    }
])
const firebaseUser = useFirebaseUser();
const loadData = async (page = 1, itemsPrepage = 10) => {
    firebaseUser.user?.getIdToken().then(async (idToken) => {
    const { data } = await useFetch<FormResponse>('/api/forms/author', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': idToken
        },
        params: {
            offset: (page - 1) * itemsPrepage,
            limit: itemsPrepage
        }
    });
    
    if (!data.value) return;
    forms.value = data.value.data.forms;
    totalItems.value = data.value.data.count;
})
}
loadData();
const deleteForm = async (id: string) => {
    firebaseUser.user?.getIdToken().then(async (idToken) => {
    const {data, error} =  await useFetch('/api/forms/author/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'authorization': idToken
        }
    })
    if (error.value) return;
    else loadData();
    dialog.value = false;
    })
}
</script>

<style scoped></style>