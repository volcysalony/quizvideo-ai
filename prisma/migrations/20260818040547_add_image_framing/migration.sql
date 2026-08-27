-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "imageFit" TEXT NOT NULL DEFAULT 'COVER',
    "imagePositionX" REAL NOT NULL DEFAULT 50,
    "imagePositionY" REAL NOT NULL DEFAULT 50,
    "imageScale" REAL NOT NULL DEFAULT 1,
    "position" INTEGER NOT NULL,
    CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("id", "imagePath", "position", "questionId", "text") SELECT "id", "imagePath", "position", "questionId", "text" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE INDEX "Option_questionId_idx" ON "Option"("questionId");
CREATE UNIQUE INDEX "Option_questionId_position_key" ON "Option"("questionId", "position");
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "imageFit" TEXT NOT NULL DEFAULT 'CONTAIN',
    "imagePositionX" REAL NOT NULL DEFAULT 50,
    "imagePositionY" REAL NOT NULL DEFAULT 50,
    "imageScale" REAL NOT NULL DEFAULT 1,
    "answerMode" TEXT NOT NULL DEFAULT 'TEXT',
    "correctAnswer" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL DEFAULT '#9333EA',
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answerMode", "backgroundColor", "correctAnswer", "createdAt", "id", "imagePath", "position", "projectId", "text", "updatedAt") SELECT "answerMode", "backgroundColor", "correctAnswer", "createdAt", "id", "imagePath", "position", "projectId", "text", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE INDEX "Question_projectId_idx" ON "Question"("projectId");
CREATE UNIQUE INDEX "Question_projectId_position_key" ON "Question"("projectId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
