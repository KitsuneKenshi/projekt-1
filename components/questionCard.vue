<template>
    <div>
        <v-card v-if="question && !finished">
            <v-card-title>
                {{ question.question }}
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
                    v-if="currentQuestion && currentQuestion > 1">Poprzednie pytanie</v-btn>
                <v-btn class="mb-4" @click="nextQuestion()"
                    v-if="currentQuestion && currentQuestion < questions.length">Następne pytanie</v-btn>
                <v-btn class="mb-4" @click="finished = true"
                    v-if="currentQuestion && currentQuestion === questions.length">Zakończ</v-btn>
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-card-title>
                Dziękujemy za wypełnienie ankiety!
            </v-card-title>
            <devOnly>
                {{ data.answers }}
            </devOnly>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { useForm } from '~/stores/currentForm';
const data = useForm();
const form = ref(data.form);
const questions = ref(data.getQuestions());
const currentQuestion = ref<number | null>(1);
const question = ref(data.getQuestion(currentQuestion.value ? currentQuestion.value : 1));
const answer = ref<{
    question: string,
    answer: string | string[],
    index: number,
    id?: string
}>({
    question: question.value ? question.value.question : '',
    answer: '',
    index: currentQuestion.value ? currentQuestion.value : 1,
    id: question.value ? question.value.id : undefined
})
const finished = ref(false);
const updating = ref(false);
if (form.value === null) {
    navigateTo('/')
}
const load = () => {
    data.setCurrentQuestion(1);
    currentQuestion.value = data.currentQuestion;
    if (question.value?.type === 'multi') {
        answer.value.answer = [];
    }
}
load();
const nextQuestion = () => {
    if (answer.value.answer && answer.value.answer.length > 0) {
        updating.value = true;
        console.log(answer.value)
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
        currentQuestion.value = data.currentQuestion;
        answer.value.index = currentQuestion.value!;
        answer.value.question = question.value?.question!;
        const answerData = data.getAnswer(currentQuestion.value!);
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
        currentQuestion.value = data.currentQuestion;
        answer.value.index = currentQuestion.value!;
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
        currentQuestion.value = data.currentQuestion;
        answer.value.index = currentQuestion.value!;
        answer.value.question = question.value?.question!;
        const answerData = data.getAnswer(currentQuestion.value!);
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
        currentQuestion.value = data.currentQuestion;
        answer.value.index = currentQuestion.value!;
        answer.value.question = question.value?.question!;
        return;
    }
}
</script>

<style scoped></style>