import prisma from "~/server/utlis/database";
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  try {
    if (!id)
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    const data = await prisma.form.findUnique({
      where: {
        id: id,
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
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
