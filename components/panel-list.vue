<template>
    <div>
        <v-card-title>
            <h1 class="text-h5">Ankiety</h1>
        </v-card-title>
        <v-btn block to="/panel/edit" color="primary">Dodaj Ankietę <v-icon right>mdi-database-plus</v-icon></v-btn>
        <v-card-text>
            <v-data-table v-model:headers="headers" :items="forms" :items-per-page="itemsPrepage">
                <template #item.actions="{ item }">
                    <div class="d-flex">
                        <v-btn class="mr-1" size="x-small" :to="'/panel/edit/' + item.id" color="primary" icon><v-icon right>mdi-pencil</v-icon></v-btn>
                        <v-btn size="x-small" @click="test()" color="error" icon><v-icon right>mdi-delete</v-icon></v-btn>
                    </div>
                </template>
            </v-data-table>
        </v-card-text>
    </div>
</template>

<script setup lang="ts">import { useFirebaseUser } from '~/stores/firebase';

const itemsPrepage = ref(5)
const forms = ref([
    {
        title: "test",
        state: "test",
        createdAt: "test",
        updatedAt: "test",
        id: "test",
    }
]);
const headers = ref([
    {
        title: 'Tytuł',
        key: 'title',
        align: "start",
    },
    {
        title: 'Status',
        key: 'state',
        align: "end",
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
const test = () => {
    const firebaseUser = useFirebaseUser();
    firebaseUser.user?.getIdToken().then(idToken => {
        useFetch('/api/forms/add', {
        method: 'POST',
        body: JSON.stringify({
            title: "test",
            state: "test",
            createdAt: "test",
            updatedAt: "test",
        }),
        headers: {
            'authorization': idToken
        }
    }).then(res => {
        console.log(res)
    }).catch(err => {
       console.log(err)
    })
    }).catch(err => {
        console.log(err)
    })
}
</script>

<style scoped></style>