-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "seoDescription" VARCHAR(320),
ADD COLUMN     "seoTitle" TEXT,
ADD COLUMN     "shortDescription" VARCHAR(300),
ADD COLUMN     "specifications" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "publicId" TEXT;
