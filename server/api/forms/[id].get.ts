import prisma from "~/server/utlis/database";
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  try {
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
  } catch (e) {
    console.log(e);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
