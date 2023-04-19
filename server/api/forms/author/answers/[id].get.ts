import verifyToken from "~/server/func/verifyToken";
import prisma from "~/server/utlis/database";

export default defineEventHandler(async (event) => {
  const { offset: offsetRaw, limit: limitRaw } = getQuery(event);
  let offset = offsetRaw ? Number(offsetRaw) : 0;
  let limit = limitRaw ? Number(limitRaw) : 10;
  const { authorization } = event.node.req.headers;
  if (!authorization)
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  const id = event.context.params?.id;
  if (!id)
    throw createError({
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
    if (!form) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }
    const answers = await prisma.formResponse.findMany({
        where: {
            formId: id,
        },
        take: isNaN(limit) ? 10 : Number(limit),
        skip: isNaN(offset) ? 0 : Number(offset),
    });
    const count = await prisma.formResponse.count({
        where: {
            formId: id,
        }
    });
    return {
        statusCode: 200,
        statusMessage: "OK",
        data: {
            answers,
            count,
        },
    };
  } catch (e: any) {
    if (e.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    } else if (e.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else if (e.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }
    console.log(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
