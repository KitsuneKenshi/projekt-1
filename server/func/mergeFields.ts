import prisma from "~/server/utlis/database";

export default async (
  fields: {
    id: string;
    question: string;
    answers: string[];
    type: string;
    formId: string;
  }[]
) => {
  try {
    const prismaFields = await prisma.formField.findMany({
      where: {
        formId: fields[0].formId,
      },
    });
    // necessary to filter out undefined values and not get type error from TS
    const filter = <T>(x: T | undefined): x is T => {
      return x !== undefined;
    };
    const toDelete: string[] = [];
    const toCreate: {
      id: string;
      question: string;
      answers: string[];
      type: string;
      formId: string;
    }[] = [];
    const updated = prismaFields
      .map((field) => {
        if (fields.find((f) => f.id === field.id)) {
          return fields.find((f) => f.id === field.id);
        } else {
          toDelete.push(field.id);
        }
      })
      .filter(filter);
    fields
      .filter((field) => !prismaFields.find((f) => f.id === field.id))
      .forEach((field) => {
        toCreate.push(field);
      });
    const deleted = await prisma.formField.deleteMany({
      where: {
        id: {
          in: toDelete,
        },
      },
    });
    const created = await prisma.formField.createMany({
      data: toCreate,
    });
    const updatedFields = await prisma.$transaction(
      updated.map((field) => {
        return prisma.formField.update({
          where: {
            id: field.id,
          },
          data: {
            question: field.question,
            type: field.type,
            answers: field.answers,
          },
        });
      })
    );

    return [
      {
        deleted,
        created,
        updatedFields,
      },
      null,
    ];
  } catch (e) {
    console.log(e);
    return [null, e];
  }
};
