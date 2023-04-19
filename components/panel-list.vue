<template>
    <div>
        <v-card-title>
            <h1 class="text-h5">Ankiety</h1>
        </v-card-title>
        <v-btn block to="/panel/edit" color="primary">Dodaj Ankietę <v-icon right>mdi-database-plus</v-icon></v-btn>
        <v-card-text>
            <v-data-table-server v-model:headers="headers"
            :items-length="totalItems"
            :items="forms"
            :items-per-page="itemsPerPage"
            :loading="loading"
            @update:options="loadData">
                <template #item.actions="{ item }">
                    <div class="d-flex">
                        <v-btn class="mr-1" size="x-small" :to="'/panel/edit/' + item.value" color="primary" icon><v-icon
                                right>mdi-pencil</v-icon></v-btn>
                        <v-btn class="mr-1" size="x-small" @click="" color="error" icon><v-icon right>mdi-delete</v-icon>
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
                        <v-btn icon size="x-small" :to="'/panel/answers/' + item.value" color="green"><v-icon>mdi-database-eye</v-icon></v-btn>
                    </div>
                </template>
            </v-data-table-server>
        </v-card-text>
    </div>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';
import { useFirebaseUser } from '~/stores/firebase';
const loading = ref(false);
const dialog = ref(false);
const itemsPerPage = ref(10)
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
const loadData = async ({page, itemsPerPage}: {page: number, itemsPerPage: number}) => {
    loading.value = true;
    firebaseUser.user?.getIdToken().then(async (idToken) => {
    const { data } = await useFetch<FormResponse>('/api/forms/author', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': idToken
        },
        params: {
            offset: (page - 1) * itemsPerPage,
            limit: itemsPerPage
        }
    });
    
    if (!data.value) return;
    totalItems.value = data.value.data.count;
    forms.value = data.value.data.forms;
    loading.value = false;
})
}
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
    else loadData({page: 1, itemsPerPage: 10});
    dialog.value = false;
    })
}
</script>

<style scoped></style>