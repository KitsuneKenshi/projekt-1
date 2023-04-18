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
            answer: string | string[],
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
            this.currentQuestion = index;
            return this.form.fields[index - 1];
        },
        getNextQuestion () {
            if(!this.form) return null;
            if(this.currentQuestion === null) return null;
            if(this.currentQuestion === this.form.fields.length) return null;
            this.currentQuestion += 1;
            return this.form.fields[this.currentQuestion - 1];
        },
        getPrevQuestion () {
            if(!this.form) return null;
            if(this.currentQuestion === null) return null;
            if(this.currentQuestion === 1) return null;
            this.currentQuestion -= 1;
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
        setAnswer (answer: {
            question: string,
            answer: string | string[],
            index: number,
            id?: string
        }) {
            const index = this.answers.findIndex((a) => a.index === answer.index);
            if(index === -1) return this.answers.push(answer);
            this.answers[index] = answer;
            return;
        },
        getAnswer (index: number) {
            return this.answers.find((answer) => answer.index === index);
        },
        setCurrentQuestion (index: number) {
            this.currentQuestion = index;
        }
    }
})
    