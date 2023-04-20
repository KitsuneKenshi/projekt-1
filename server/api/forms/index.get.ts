import prisma from "~/server/utlis/database"
export default defineEventHandler(async (event) => {
    const {offset: offsetRaw, limit: limitRaw} = getQuery(event);
    let offset = offsetRaw? Number(offsetRaw) :  0;
    let limit = limitRaw? Number(limitRaw) : 10;
    const forms = await prisma.form.findMany({
        take: isNaN(limit)? 10 : Number(limit),
        skip: isNaN(offset)? 0 : Number(offset),
        orderBy: {
            createdAt: 'desc'
        }
    })
    const count = await prisma.form.count()
    return {
        statusCode: 200,
        statusMessage: 'OK',
        data: {
            forms,
            count
        }
    }
})