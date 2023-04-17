import prisma from "~/server/utlis/database";
import verifyToken from "~/server/func/verifyToken";
export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const { authorization } = headers;
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
    const id = event.context.params?.id;
    if (!id)
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    prisma.form.deleteMany({
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
    return {
      statusCode: 200,
      statusMessage: "OK",
    };
  } catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
