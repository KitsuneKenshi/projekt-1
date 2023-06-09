import verifyToken from "~/server/func/verifyToken";
import prisma from "~/server/utlis/database";
import {nanoid} from "nanoid";
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
      if(field.answers.length < 2 && (field.type === 'single' || field.type === 'multi')) return false;
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
    const id = nanoid();
    const readyFields = fields.map((field: any) => {
      return {
        id: nanoid(),
        question: field.question,
        type: field.type,
        answers: field.answers
      };
    });

    const form = await prisma.form.create({
      data: {
        id,
        name,
        description,
        authorId: user.uid,
        image: "https://picsum.photos/1000/1000?random=" + Math.floor(Math.random() * 10),
        fields: {
          create: readyFields,
        },
      },
    });
    return {
      statusCode: 200,
      statusMessage: "OK",
      data: form.id,
    };
  } catch (e: any) {
    console.log(e);
    if(e.statusCode === 401) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    } else if (e.statusCode === 400) {
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