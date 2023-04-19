<template>
    <div>
        <v-card v-if="question && !finished">
            <v-card-title>
               #{{ data.currentQuestion }} {{ question.question }}
            </v-card-title>
            <v-card-text v-if="!updating">
                <v-radio-group v-if="question.type === 'single'" v-model="answer.answer" row>
                    <v-radio v-for="option in question.answers" :label="option" :value="option"></v-radio>
                </v-radio-group>
                <v-checkbox v-if="question.type === 'multi'" v-for="(option, index) in question.answers" :label="option"
                    :value="option" v-model="answer.answer[index]">
                </v-checkbox>
                <v-text-field v-if="question.type === 'short'" v-model="answer.answer" label="Answer"
                    required></v-text-field>
                <v-textarea v-if="question.type === 'long'" v-model="answer.answer" label="Answer" required></v-textarea>
                <v-btn class="mb-4 mr-4" @click="previousQuestion()"
                    v-if="data.currentQuestion && data.currentQuestion > 1">Poprzednie pytanie</v-btn>
                <v-btn class="mb-4" @click="nextQuestion()"
                    v-if="data.currentQuestion && data.currentQuestion < questions.length">Następne pytanie</v-btn>
                <v-btn class="mb-4" @click="submit()"
                    v-if="data.currentQuestion && data.currentQuestion === questions.length">Zakończ</v-btn>
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-card-title>
                Dziękujemy za wypełnienie ankiety!
            </v-card-title>
            <v-card-text>
                <v-alert type="error" v-if="error.show">{{ error.message }}</v-alert>
                <v-btn class="mb-4" @click="navigateTo('/')">Wróć do strony głównej</v-btn>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { useForm } from '~/stores/currentForm';
const data = useForm();
const form = ref(data.form);
const questions = ref(data.getQuestions());
const question = ref(data.getQuestion(1));
const error = ref({
    message: '',
    show: false
});
const answer = ref<{
    question: string,
    answer: string | string[],
    index: number,
    id?: string
}>({
    question: question.value ? question.value.question : '',
    answer: '',
    index: 1,
    id: question.value? question.value.id : undefined
})
const finished = ref(false);
const updating = ref(false);
if (form.value === null) {
    navigateTo('/')
}
const load = () => {
    data.setCurrentQuestion(1);
    if (question.value?.type === 'multi') {
        answer.value.answer = [];
    }
}
load();
const nextQuestion = () => {
    if (answer.value.answer && answer.value.answer.length > 0) {
        updating.value = true;
        const temp = {
            question: answer.value.question,
            answer: answer.value.answer,
            index: answer.value.index,
            id: answer.value.id
        };
        data.setAnswer(temp)
        question.value = data.getNextQuestion();
        if (question.value?.type === 'multi') {
            answer.value.answer = [];
        } else {
            answer.value.answer = '';
        }
        answer.value.index = data.currentQuestion!;
        answer.value.question = question.value?.question!;
        const answerData = data.getAnswer(data.currentQuestion!);
        if (answerData) {
            answer.value = answerData;
        }
        updating.value = false;
        return;
    } else {
        question.value = data.getNextQuestion();
        if (question.value?.type === 'multi') {
            answer.value.answer = [];
        } else {
            answer.value.answer = '';
        }
        answer.value.index = data.currentQuestion!;
        answer.value.question = question.value?.question!;
        return;
    }
}
const previousQuestion = () => {
    if (answer.value.answer && answer.value.answer.length > 0) {
        updating.value = true;
        const temp = {
            question: answer.value.question,
            answer: answer.value.answer,
            index: answer.value.index,
            id: answer.value.id
        };
        data.setAnswer(temp)
        question.value = data.getPrevQuestion();
        if (question.value?.type === 'multi') {
            answer.value.answer = [];
        } else {
            answer.value.answer = '';
        }
        answer.value.index = data.currentQuestion!;
        answer.value.question = question.value?.question!;
        const answerData = data.getAnswer(data.currentQuestion!);
        if (answerData) {
            answer.value = answerData;
        }
        updating.value = false;
        return;
    } else {
        question.value = data.getPrevQuestion();
        if (question.value?.type === 'multi') {
            answer.value.answer = [];
        } else {
            answer.value.answer = '';
        }
        answer.value.index = data.currentQuestion!;
        answer.value.question = question.value?.question!;
        return;
    }
}
const submit = () => {
    if (answer.value.answer && answer.value.answer.length > 0) {
        updating.value = true;
        const temp = {
            question: answer.value.question,
            answer: answer.value.answer,
            index: answer.value.index,
            id: answer.value.id
        };
        data.setAnswer(temp)
        useFetch(`/api/forms/answers/${data.form?.id}`, {
            method: 'POST',
            body: JSON.stringify(data.answers)
        }).then((res) => {
            if(res.error.value) {
                console.log(res.error)
                error.value = {
                    message: 'Wystąpił błąd podczas wysyłania odpowiedzi (Więcej informacji w konsoli)',
                    show: true
                }
            }
        })
        updating.value = false;
        finished.value = true;
        return;
    } else {
        useFetch(`/api/forms/answers/${data.form?.id}`, {
            method: 'POST',
            body: JSON.stringify(data.answers)
        }).then((res) => {
            if(res.error.value) {
                console.log(res.error)
                error.value = {
                    message: 'Wystąpił błąd podczas wysyłania odpowiedzi (Więcej informacji w konsoli)',
                    show: true
                }
            }
        })
        finished.value = true;
        return;
    }
}
</script>

<style scoped></style>