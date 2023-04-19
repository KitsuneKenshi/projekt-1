import prisma from "~/server/utlis/database";
import verifyToken from "~/server/func/verifyToken";
export default defineEventHandler(async (event) => {
  const { authorization } = event.node.req.headers;
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
    if (!data)
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    return {
      statusCode: 200,
      statusMessage: "OK",
      data,
    };
  } catch (e: any) {
    console.log(e);
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
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
