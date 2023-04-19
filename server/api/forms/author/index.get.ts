import prisma from "~/server/utlis/database";
import verifyToken from "~/server/func/verifyToken";
export default defineEventHandler(async (event) => {
  const { authorization } = event.node.req.headers;
  if (!authorization)
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  try {
    const user = await verifyToken(authorization);
    if (!user)
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    const { offset: offsetRaw, limit: limitRaw } = getQuery(event);
    let offset = offsetRaw ? Number(offsetRaw) : 0;
    let limit = limitRaw ? Number(limitRaw) : 10;
    const forms = await prisma.form.findMany({
      take: isNaN(limit) ? 10 : Number(limit),
      skip: isNaN(offset) ? 0 : Number(offset),
        where: {
            authorId: user.uid
        }
    });
    const count = await prisma.form.count();
    return {
      statusCode: 200,
      statusMessage: "OK",
      data: {
        forms,
        count,
      },
    };
  } catch (e: any) {
    if (e.statusCode === 401) {
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
