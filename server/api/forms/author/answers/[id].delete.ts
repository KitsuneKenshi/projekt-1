import verifyToken from "~/server/func/verifyToken";
import prisma from "~/server/utlis/database";

export default defineEventHandler(async (event) => {
    const {authorization} = event.node.req.headers;
    if (!authorization)
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
    const id = event.context.params?.id;
    if(!id) throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
    });
    try {
        const user = await verifyToken(authorization);
        if (!user)
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
            });
        const form = await prisma.form.findFirst({
            where: {
                AND: [
                    {
                        id: id,
                    },
                    {
                        authorId: user.id,
                    },
                ],
            },
        });
        if(!form) throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        });
        const {ansId} = await readBody(event);
        if(!ansId) throw createError({
            statusCode: 400,
            statusMessage: "Bad Request",
        });
        await prisma.formResponse.deleteMany({
            where: {
                AND: [
                    {
                        id: ansId,
                    },
                    {
                        formId: id,
                    },
                ]
            },
        });
        return {
            statusCode: 200,
            statusMessage: "OK",
        };
    } catch (e: any) {
        if(e.statusCode === 400) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
            });
        } else if(e.statusCode === 401) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
            });
        }
        console.log(e);
        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error",
        });
    }
});