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
  const id = event.context.params?.id;
  try {
    const user = await verifyToken(authorization);
    if (!user)
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    const data = await prisma.form.findFirst({
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
      include: {
        fields: true,
      },
    });
    return {
      statusCode: 200,
      statusMessage: "OK",
      data,
    };
  } catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
