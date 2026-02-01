--  psql -h 18.237.155.139 -p 5432 -U skillmatch -d skillmatch
-- sample data 
INSERT INTO "skill" ("skillTitle") VALUES 
('Python'),
('React'),
('JavaScript'),
('Node.js'),
('TypeScript'),
('Java'),
('C++'),
('HTML'),
('CSS'),
('SQL'),
('MongoDB'),
('Express.js'),
('Django'),
('Flask'),
('Ruby on Rails'),
('Angular'),
('Vue.js'),
('Kotlin'),
('Swift'),
('PHP');





DROP TABLE IF EXISTS "userSkill";
DROP TABLE IF EXISTS "skill";
DROP TABLE IF EXISTS "userFirebase";
DROP TABLE IF EXISTS "user";

-- Table: "user"
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR UNIQUE,
    "fullName" VARCHAR,
    "email" VARCHAR UNIQUE,
    "sex" VARCHAR DEFAULT 'unspecified',
    "role" VARCHAR DEFAULT 'user',
    "birthday" TIMESTAMP,
    "password" VARCHAR, -- assuming 'password hash' means a hashed password stored as a string
    "isVerify" BOOLEAN DEFAULT false,
    "status" VARCHAR DEFAULT 'active',
    "followerCount" INT DEFAULT 0,
    "followingCount" INT DEFAULT 0,
    "profilePictureUrl" VARCHAR,
    "bio" VARCHAR,
    "loginMethod" VARCHAR,
    "lastLogin" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "deletedAt" TIMESTAMP
);

-- Table: "userFirebase"
CREATE TABLE "userFirebase" (
    "id" SERIAL PRIMARY KEY,
    "userId" INT REFERENCES "user"("id") ON DELETE CASCADE,
    "firebaseToken" VARCHAR
);


CREATE TABLE "skill" (
    "id" SERIAL PRIMARY KEY,
    "skillTitle" VARCHAR
);

CREATE TABLE "userSkill" (
    "id" SERIAL PRIMARY KEY,
    "description" VARCHAR,
    "portfolio" VARCHAR,
    "picture" VARCHAR,
    "userId" INT REFERENCES "user"("id") ON DELETE CASCADE,
    "skillId" INT REFERENCES "skill"("id") ON DELETE CASCADE
);

CREATE TABLE "userInterest" (
    "id" SERIAL PRIMARY KEY,
    "description" VARCHAR,
    "interestLevel" VARCHAR,
    "userId" INT REFERENCES "user"("id") ON DELETE CASCADE,
    "interestId" INT REFERENCES "interest"("id") ON DELETE CASCADE
);

CREATE TABLE "interest" (
    "id" SERIAL PRIMARY KEY,
    "interestTitle" VARCHAR
);

CREATE TABLE "session" (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "post" (
    "id" SERIAL PRIMARY KEY,
    "authorId" INT REFERENCES "user"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "skills" JSON,
    "description" TEXT,
    "imageUrl" VARCHAR(255),
    "stats" JSON,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "post_member" (
    "id" SERIAL PRIMARY KEY,
    "projectId" INT REFERENCES "post"("id") ON DELETE CASCADE,
    "userId" INT REFERENCES "user"("id") ON DELETE CASCADE,
    "role" VARCHAR(50) DEFAULT 'member', -- e.g., 'member', 'admin', 'viewer'
    "status" VARCHAR(50) DEFAULT 'active', -- e.g., 'active', 'removed', 'pending'
    "joinedAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "comments" (
    "id" SERIAL PRIMARY KEY,
    "projectId" INT REFERENCES "post"("id") ON DELETE CASCADE,
    "memberId" INT REFERENCES "post_member"("id") ON DELETE CASCADE,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

