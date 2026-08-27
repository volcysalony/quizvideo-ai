-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "answerMode" TEXT NOT NULL DEFAULT 'TEXT',
    "correctAnswer" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL DEFAULT '#9333EA',
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("backgroundColor", "correctAnswer", "createdAt", "id", "imagePath", "position", "projectId", "text", "updatedAt") SELECT "backgroundColor", "correctAnswer", "createdAt", "id", "imagePath", "position", "projectId", "text", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE INDEX "Question_projectId_idx" ON "Question"("projectId");
CREATE UNIQUE INDEX "Question_projectId_position_key" ON "Question"("projectId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
