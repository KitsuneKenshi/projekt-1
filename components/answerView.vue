<template>
    <div>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
        <v-card v-if="form && !loading">
            <v-card-title v-if="!answers.length">
                Brak odpowiedzi
            </v-card-title>
            <v-card-title v-if="answers.length">
                {{ form.name }}
                <v-spacer></v-spacer>
                <div v-if="answers.length" class="d-felx">
                    <v-pagination @update:model-value="load($event)" v-if="answers" :length="answersLenght" :model-value="currentAnswer"></v-pagination>
                    <v-text-field type="number" :model-value="currentAnswer"
                        @change:model-value="load($event)"></v-text-field>
                </div>
            </v-card-title>
            <v-card-text v-if="persInfo">
                <v-btn prepend-icon="mdi-delete" @click="deleteAns" color="error" block>Usuń</v-btn> <br>
                Informacje o użytkowniku: <br>
                Imię: {{ persInfo.name }} <br>
                Nazwisko: {{ persInfo.secondname }} <br>
                Email: {{ persInfo.email }} <br>
            </v-card-text>
            <v-card-text v-if="answers.length">
                <v-card v-if="currentQuestion">
                    <v-card-title v-if="question">
                        {{ question.question }}
                    </v-card-title>
                    <v-card-text>
                        <v-radio-group v-if="question.type === 'single'" v-model="answer.answer" row>
                            <v-radio  disabled v-for="option in question.answers" :label="option" :value="option"></v-radio>
                        </v-radio-group>
                        <v-checkbox disabled v-if="question.type === 'multi'" v-for="(option, index) in question.answers"
                            :label="option" :value="option" v-model="answer.answer[index]">
                        </v-checkbox>
                        <v-text-field disabled v-if="question.type === 'short'" v-model="answer.answer" label="Answer"
                            required></v-text-field>
                        <v-textarea disabled v-if="question.type === 'long'" v-model="answer.answer" label="Answer"
                            required></v-textarea>
                        <v-btn class="mr-4" color="primary" @click="prev" v-if="currentQuestion > 1">Poprzednie pytanie</v-btn>
                        <v-btn color="primary" @click="next" v-if="currentQuestion < form.fields.length">Następne pytanie</v-btn>
                        
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import FormResponse from '~/Types/formResponse';
import { useFirebaseUser } from '~/stores/firebase';
const answers = ref<{
    id: string,
    formId: string,
    responses: {
        question: string,
        answer: string | string[],
        index: number,
        id: string
    }[]
}[]>([])
const answersLenght = ref(0)
const currentAnswer = ref(1)
const currentQuestion = ref(1)
const persInfo = ref<{
    name: string,
    email: string,
    secondname: string
}>();
const form = ref<{
    id: string,
    name: string,
    description: string,
    image: string,
    fields: {
        id: string,
        question: string,
        type: string,
        answers: string[]
    }[],
    createdAt: string,
    updatedAt: string
} | null>(null);
const answer = ref<{
    question: string,
    answer: string | string[],
    index: number,
    id: string
}>({
    question: '',
    answer: '',
    index: 0,
    id: ''
})
const question = ref<{
    question: string,
    type: string,
    answers: string[]
}>({
    question: '',
    type: '',
    answers: []
})
const route = useRoute();
const firebaseUser = useFirebaseUser();
const loading = ref(true);
const load = (page = 1) => {
    currentAnswer.value = page
    loading.value = true;
    const formId = route.params.id
    firebaseUser.user?.getIdToken().then(idToken => {
        useFetch<{
            data: {
                answers: {
                    id: string,
                    formId: string,
                    responses: {
                        question: string,
                        answer: string | string[],
                        index: number,
                        id: string
                    }[]
                }[],
                count: number
            }
        }>('/api/forms/author/answers/' + formId, {
            method: 'GET',
            headers: {
                'authorization': idToken
            },
            params: {
                offset: (page - 1) * 1,
                limit: 1
            }
        }).then((response) => {
            if (response.error.value) {
                console.log(response.error.value)
                return;
            } else {
                if (response.data.value) {
                    if (response.data.value.data.answers && response.data.value.data.count) {
                        answers.value = response.data.value.data.answers
                        answersLenght.value = response.data.value.data.count
                        if (answers.value[0].responses[0]) {
                            const info = answers.value[0].responses[0]
                            persInfo.value = JSON.parse(info.answer as string)
                        }
                        if(answers.value[0].responses[currentQuestion.value]) {
                            answer.value = answers.value[0].responses[currentQuestion.value]
                        }
                    }
                }
            }
        })
        useFetch<FormResponse>('/api/forms/author/' + formId, {
            method: 'GET',
            headers: {
                'authorization': idToken
            }
        }).then((response) => {
            if (response.error.value) {
                console.log(response.error.value)
                return;
            } else {
                if (response.data.value) {
                    form.value = response.data.value.data
                    if (form.value && form.value.fields[currentQuestion.value - 1]) {
                    question.value = form.value.fields[currentQuestion.value - 1]
                    }
                }
            }
        })
        loading.value = false;
    }).catch(err => {
        console.log(err)
    });

}
load();
const next = () => {
    currentQuestion.value++;
    question.value = form.value?.fields[currentQuestion.value - 1] as {
        question: string,
        type: string,
        answers: string[]
    }
    answer.value = answers.value[0].responses[currentQuestion.value]
}
const prev = () => {
    currentQuestion.value--;
    question.value = form.value?.fields[currentQuestion.value - 1] as {
        question: string,
        type: string,
        answers: string[]
    }
    answer.value = answers.value[0].responses[currentQuestion.value]
}
const deleteAns = () => {
    firebaseUser.user?.getIdToken().then(idToken => {
        const formId = route.params.id
        useFetch('/api/forms/author/answers/' + formId, {
            method: 'DELETE',
            headers: {
                'authorization': idToken
            },
            body: {
                ansId: answers.value[0].id
            }
        }).then((response) => {
            if (response.error.value) {
                console.log(response.error.value)
                return;
            } else {
                if (response.data.value) {
                    load(1)
                }
            }
        })
    }).catch(err => {
        console.log(err)
    });
}
</script>

<style scoped></style>