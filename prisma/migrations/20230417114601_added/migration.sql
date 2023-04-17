-- DropForeignKey
ALTER TABLE "formField" DROP CONSTRAINT "formField_formId_fkey";

-- AddForeignKey
ALTER TABLE "formField" ADD CONSTRAINT "formField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
