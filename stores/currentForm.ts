import {defineStore} from 'pinia';

export const useForm = defineStore('currentForm', {
    state: () => ({
        form: null as {
            name: string,
            description: string,
            image: string,
            fields: {
                question: string,
                type: string,
                answers: string[],
                id?: string
            }[]
        } | null,
        currentQuestion: 0 as number | null,
        answers: [] as {
            index: number,
            question: string,
            answer: string,
            id?: string
        }[]
    }),
    getters: {
        isFilled: (state) => !!state.form,
        },
    actions: {
        getQuestions () {
            if(!this.form) return [];
            return this.form.fields;
        },
        getQuestion (index: number) {
            if(!this.form) return null;
            return this.form.fields[index];
        },
        getNextQuestion () {
            if(!this.form) return null;
            if(this.currentQuestion === null) return null;
            return this.form.fields[this.currentQuestion + 1];
        },
        getPrevQuestion () {
            if(!this.form) return null;
            if(this.currentQuestion === null) return null;
            return this.form.fields[this.currentQuestion - 1];
        },
        setForm (form: {
            name: string,
            description: string,
            image: string,
            fields: {
                question: string,
                type: string,
                answers: string[],
                id?: string
                }[]
                }) {
            this.form = form;
        },
        pushAnswer (answer: {
            question: string,
            answer: string,
            index: number,
            id?: string
        }) {
            this.answers.push(answer);
        },
        setAnswer (answer: {
            question: string,
            answer: string,
            index: number,
            id?: string
        }) {
            this.answers[answer.index] = answer;
        }
    }
})
    