import { nanoid } from "nanoid";
import prisma from "~/server/utlis/database";
export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    const answersRaw = await readBody(event);
    try {
        //validate id
        if(!id || typeof id !== 'string') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request'
            })
        }
        const form = await prisma.form.findUnique({
            where: {
                id: id
            }
        })
        if(!form) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found'
            })
        }
        //validate answers
        const answers = answersRaw.map((answer: {
            index: number,
            question: string,
            answer: string | string[],
            id: string
        }) => {
            if(!answer.question || !answer.answer || !answer.id || typeof answer.index !== 'number' || typeof answer.question !== 'string' || typeof answer.id !== 'string' || (typeof answer.answer !== 'string' && !Array.isArray(answer.answer))) {
                throw createError({
                    statusCode: 400,
                    statusMessage: 'Bad Request'
                })
            }
            return {
                index: answer.index,
                question: answer.question,
                answer: answer.answer,
                id: answer.id
            }
        })
        //save answers
        await prisma.formResponse.create({
            data: {
                responses: answers,
                formId: id,
                id: nanoid()
            }
        })
        return {
            statusCode: 200,
            statusMessage: 'OK',
        }
    } catch(e: any) {
        console.log(e);
        if(e.statusCode === 400) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request'
            })
        } else if(e.statusCode === 404) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found'
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        })
    }
})