<template>
    <div>
        <clientOnly>
        <v-card :loading="loading" v-if="form">
            <v-card-title>
                {{ form.name }}
            </v-card-title>
            <v-card-text>
                    <v-form v-model="formData">
                        <v-text-field :rules="nameRule" :counter="15" label="Imię" v-model="dataObj.name"></v-text-field>
                        <v-text-field :rules="nameRule" label="Nazwisko" v-model="dataObj.secondname"></v-text-field>
                        <v-text-field :rules="emailRules" label="Email" v-model="dataObj.email"></v-text-field>
                        <v-btn :disabled="!formData" block type="submit" @click.prevent="submit()">Przejdź do Formularza</v-btn>
                    </v-form>
            </v-card-text>
        </v-card>
    </clientOnly>
    </div>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';
import { useForm } from '~/stores/currentForm';
const route = useRoute();
const loading = ref(true);
const id = ref(route.params.id);
const formData = ref();
const form = ref<{
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string
} | null>(null);
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
            type: 'firstPage',
            answer: "",
            id: "none"
        });
const dataObj = ref({
    name: '',
    secondname: '',
    email: ''
})
const nameRule = ref([
    (v: string) => !!v || 'Imię jest wymagane',
    (v: string) => (v && v.length <= 15) || 'Imię nie może być dłuższe niż 15 znaków',
])
const emailRules = ref([
    (v: string) => !!v || 'Email jest wymagany',
    (v: string) => /.+@.+\..+/.test(v) || 'Email musi być prawidłowy',
])
const load = async () => {
    formStore.reset();
    const { data } = await useFetch<FormResponse>(`/api/forms/${id.value}`);
    if (!data.value) return;
    formStore.setForm(data.value.data);
    form.value = data.value.data;
    loading.value = false;
}
load();
const submit = async () => {
    if(answers.value) {
        answers.value.answer = JSON.stringify(dataObj.value);
        formStore.setAnswer(answers.value!);
        navigateTo(`/form/${id.value}/questions`);
    }
}
</script>

<style scoped>

</style>
