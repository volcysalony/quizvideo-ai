-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'VERTICAL',
    "width" INTEGER NOT NULL DEFAULT 1080,
    "height" INTEGER NOT NULL DEFAULT 1920,
    "fps" INTEGER NOT NULL DEFAULT 30,
    "introSeconds" REAL NOT NULL DEFAULT 1,
    "countdownSeconds" REAL NOT NULL DEFAULT 6,
    "revealSeconds" REAL NOT NULL DEFAULT 2,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "correctAnswer" INTEGER NOT NULL,
    "backgroundColor" TEXT NOT NULL DEFAULT '#9333EA',
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imagePath" TEXT,
    "position" INTEGER NOT NULL,
    CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Render" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "outputPath" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    CONSTRAINT "Render_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Question_projectId_idx" ON "Question"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_projectId_position_key" ON "Question"("projectId", "position");

-- CreateIndex
CREATE INDEX "Option_questionId_idx" ON "Option"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Option_questionId_position_key" ON "Option"("questionId", "position");

-- CreateIndex
CREATE INDEX "Render_projectId_idx" ON "Render"("projectId");
