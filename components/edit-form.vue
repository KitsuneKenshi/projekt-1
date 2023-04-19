<template>
    <v-card>
        <v-card-text>
            <v-form v-model="formData">
                <v-text-field :rules="required" label="Name" v-model="form.name" />
                <v-text-field :rules="required" label="Description" v-model="form.description" />
                <v-text-field label="Image" :rules="linkRules" v-model="form.image" />
                <v-btn color="primary" @click="addQuestion">Add question</v-btn>
                <v-card class="mt-4" v-for="(field, index) in form.fields" :key="index">
                    <v-card-text >
                        <v-text-field v-model="field.question" label="Question"    />
                        <v-select label="Type" v-model="field.type" :items="['single', 'multi', 'short', 'long']" />
                        <v-btn color="primary" class="mr-4" v-if="field.type == 'single' || field.type == 'multi'"
                            @click="addAnswer(index)">Add answer</v-btn>
                        <v-btn color="error" @click="removeQuestion(index)">Remove question</v-btn>
                        <v-card class="mt-4" v-for="(answer, index2) in field.answers" :key="index2">
                            <v-card-text>
                                <v-text-field label="Answer" v-model="field.answers[index2]" />
                                <v-btn size="x-small" color="error" @click="removeAnswer(index, index2)"
                                    icon><v-icon>mdi-delete</v-icon></v-btn>
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                </v-card>
                <v-spacer></v-spacer>
                <v-btn :disabled="!formData || disable" color="green" class="mt-4" @click="submit()">Save</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';
import {useFirebaseUser} from '~/stores/firebase';
const disable = ref(false);
const route = useRoute();
const mode = ref(route.params.id ? 'edit' : 'create');
const formData = ref()
const form: globalThis.Ref<
    {
        name: string,
        description: string,
        image: string,
        fields: {
            question: string,
            type: string,
            answers: string[],
            id?: string
        }[]
    }> = ref(
        {
            name: '',
            description: '',
            image: '',
            fields: []
        }
    )
const linkRules = ref([
(v: string) => !!v || 'Link jest wymagany',
(v: string) => (v && v.length <= 200) || 'Link musi mieć mniej niż 200 znaków',
(v: string) => (v && /(https?:\/\/.*\.(?:png|jpg))/.test(v)) || 'Link musi być poprawnym linkiem do obrazka'
])
const required = ref([
        (v: any) => !!v || 'Pole jest wymagane',
])
const addQuestion = () => {
    form.value.fields.push({
        question: '',
        type: 'single',
        answers: []
    })
    disable.value = true
}
watch(() => form.value.fields, (newForm) => {
    console.log(newForm)
    if (newForm.length > 0) {
        for(const field of newForm) {
            if (field.question == '' || field.type == '') {
                disable.value = true
                break;
            }
            if (field.type == 'single' || field.type == 'multi') {
                if (field.answers.length == 0) {
                    disable.value = true
                    break;
                }
                for(const answer of field.answers) {
                    if (answer == '') {
                        disable.value = true
                        break;
                    }
                }
            }
        }
    } else {
        disable.value = true
    }
})
const addAnswer = (index: number) => {
    form.value.fields[index].answers.push('')
}
const removeAnswer = (index: number, index2: number) => {
    form.value.fields[index].answers.splice(index2, 1)
}
const removeQuestion = (index: number) => {
    form.value.fields.splice(index, 1)
}
const firebaseUser = useFirebaseUser();
const submit = () => {
    if (mode.value == 'create') {    
        firebaseUser.user?.getIdToken().then(idToken => {
            useFetch('/api/forms/author/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': idToken
                },
                body: JSON.stringify(form.value)
            }).then((response) => {
                if (response.data.value) {
                    navigateTo('/panel')
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }
    if (mode.value == 'edit') {
        const formId = ref(route.params.id);
        firebaseUser.user?.getIdToken().then(idToken => {
            useFetch('/api/forms/author/' + formId.value, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': idToken
                },
                body: JSON.stringify(form.value)
            }).then((response) => {
                if (response.data.value) {
                    navigateTo('/panel')
                }
            })
        }).catch(err => {
            console.log(err)
        })
    }
}
if (mode.value == 'edit') {
    const formId = ref(route.params.id);
    firebaseUser.user?.getIdToken().then(async (idToken) => {
    useFetch<FormResponse>('/api/forms/author/' + formId.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': idToken
        }
    }).then((response) => {
        if (response.data.value && response.data.value.data) {
            form.value = response.data.value.data
        }
    })
    })
}
</script>

<style scoped></style>
