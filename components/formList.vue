<template>
    <div>
        <v-card
            class="mx-auto"
            max-width="1000"
        >
        <v-container>
            <v-row>
                <v-col
                    v-for="form in forms"
                    :key="form.id"
                    cols="12"
                    md="6"
                >
                    <v-card
                        class="mx-auto"
                    >   
                        <v-img
                            :src="form.image"
                            height="200px"
                            cover
                        ></v-img>
                        <v-card-title>
                            {{ form.name }}
                        </v-card-title>
                        <v-card-subtitle>
                            {{ form.description }}
                        </v-card-subtitle>
                        <v-card-actions>
                            <v-btn :to="`/form/${form.id}`">
                                Rozpocznij <v-icon>mdi-send</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
            <div v-intersect="onscroll"></div>
            <div class="d-flex justify-center" v-if="loading"></div>
        </v-container>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';

const loading = ref(false);
const forms = ref<{
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string
}[]>([]);
const formCount = ref(0);
const load = async () => {
    const { data } = await useFetch<FormResponse>('/api/forms');
    if (!data.value) return;
    forms.value = data.value.data.forms;
    formCount.value = data.value.data.count;
}
const onscroll = async () => {
    if(forms.value.length >= formCount.value) return;
    const { data } = await useFetch<FormResponse>('/api/forms', {
        method: 'GET',
        params: {
            offset: forms.value.length
        }
    });
    if (!data.value) return;
    forms.value.push(...data.value.data.forms);
}
load();
</script>

<style scoped></style>

