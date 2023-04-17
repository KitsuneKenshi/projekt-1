<template>
    <div>
        <v-card :loading="loading">
            <v-card-text>
                    <v-form>
                        <v-text-field label="Imię" v-model="dataObj.name"></v-text-field>
                        <v-text-field label="Nazwisko" v-model="dataObj.secondname"></v-text-field>
                        <v-text-field label="Email" v-model="dataObj.email"></v-text-field>
                        <v-btn @click="submit()">Przejdź do Formularza</v-btn>
                    </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';
import { useForm } from '~/stores/currentForm';
const route = useRoute();
const loading = ref(true);
const id = ref(route.params.id);
if(!id) navigateTo('/');
const formStore = useForm();
const answers = ref<{
            index: number,
            question: string,
            type: string,
            answer: string,
            id?: string
        }>({
            index: 0,
            question: 'FirstPageQuestion',
            type: 'custom',
            answer: ""
        });
const dataObj = ref({
    name: '',
    secondname: '',
    email: ''
})
const load = async () => {
    const { data } = await useFetch<FormResponse>(`/api/forms/${id.value}`);
    if (!data.value) return;
    formStore.setForm(data.value.data.form);
    loading.value = false;
}
load();
const submit = () => {
    if(answers.value) {
        answers.value.answer = JSON.stringify(dataObj.value);
        formStore.setAnswer(answers.value!);
        navigateTo(`/forms/${id.value}/questions`);
    }
}
</script>

<style scoped>

</style>
