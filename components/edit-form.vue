<template>
    <v-card>
        <v-card-text>
            <v-form>
                <v-text-field label="Name" v-model="form.title" />
                <v-text-field label="Description" v-model="form.description" />
                <v-text-field label="Image" v-model="form.image" />
                <v-btn color="primary" @click="addQuestion">Add question</v-btn>
                <v-card class="mt-4" v-for="(field, index) in form.fields" :key="index">
                    <v-card-text>
                        <v-text-field label="Question" v-model="field.question" />
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
                <v-btn color="green" class="mt-4" @click="submit()">Save</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import {useFirebaseUser} from '~/stores/firebase';

const route = useRoute();
const mode = ref(route.params.id ? 'edit' : 'create');

const form: globalThis.Ref<
    {
        title: string,
        description: string,
        image: string,
        fields: {
            question: string,
            type: string,
            answers: string[]
        }[]
    }> = ref(
        {
            title: '',
            description: '',
            image: '',
            fields: []
        }
    )
const addQuestion = () => {
    form.value.fields.push({
        question: '',
        type: 'single',
        answers: []
    })
}
const addAnswer = (index: number) => {
    form.value.fields[index].answers.push('')
}
const removeAnswer = (index: number, index2: number) => {
    form.value.fields[index].answers.splice(index2, 1)
}
const removeQuestion = (index: number) => {
    form.value.fields.splice(index, 1)
}
const submit = () => {
    const firebaseUser = useFirebaseUser();
    if (mode.value == 'create') {    
        firebaseUser.user?.getIdToken().then(idToken => {
            useFetch('/api/forms/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': idToken
                },
                body: JSON.stringify(form.value)
            }).then((response) => {
                if (response.ok) {
                    navigateTo('/panel')
                }
            })
        }).catch(err => {
            console.log(err)
        })
        if (mode.value == 'edit') {
            const formId = ref(route.params.id);
            useFetch('/api/forms/' + formId.value, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form.value)
            }).then((response) => {
                if (response.ok) {
                    response.json().then((data: any) => {
                        navigateTo('/panel')
                    })
                }
            })
        }
    }
}
if (mode.value == 'edit') {
    const formId = ref(route.params.id);
    useFetch('/api/forms/' + formId.value, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        if (response.ok) {
            response.json().then((data: any) => {
                form.value = data;
            })
        }
    })
}
</script>

<style scoped></style>
