-- CreateTable
CREATE TABLE "form" (
    "id" VARCHAR(21) NOT NULL,
    "authorId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "image" VARCHAR(1024) NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formField" (
    "id" VARCHAR(21) NOT NULL,
    "question" VARCHAR(255) NOT NULL,
    "answers" JSONB[],
    "type" VARCHAR(255) NOT NULL,
    "formId" TEXT NOT NULL,

    CONSTRAINT "formField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formResponse" (
    "id" VARCHAR(21) NOT NULL,
    "formId" TEXT NOT NULL,
    "responses" JSONB[],

    CONSTRAINT "formResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "formField" ADD CONSTRAINT "formField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formResponse" ADD CONSTRAINT "formResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
