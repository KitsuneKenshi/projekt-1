import prisma from "~/server/utlis/database";
import verifyToken from "~/server/func/verifyToken";
import mergeFields from "~/server/func/mergeFields";
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
    const body = await readBody(event).catch((e) => {
      console.log(e);
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    });
    const { name, description, fields } = body;
    if (
      !name ||
      !description ||
      !fields ||
      typeof name !== "string" ||
      typeof description !== "string" ||
      !Array.isArray(fields)
    )
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    const valid = fields.every((field: any) => {
      return (
        field.question &&
        field.type &&
        field.answers &&
        typeof field.question === "string" &&
        typeof field.type === "string" &&
        Array.isArray(field.answers)
      );
    });
    if (!valid)
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    const id = event.context.params?.id;
    const form = await prisma.form.findFirst({
      where: {
        AND: [
          {
            id: id,
          },
          {
            authorId: user.id,
          },
        ]
      },
      include: {
        fields: true,
      },
    });
    if (!form)
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    await mergeFields(fields);
    const data = await prisma.form.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
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
  } catch (e: any) {
    console.log(e);
    if (e.statusCode === 400) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    }
    if (e.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }
    if (e.statusCode === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
