import { db, connection } from "./index";
import { comments, posts, users } from "./schema";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { hash } from "@node-rs/argon2";

async function seed() {
  console.log("Seeding the database...");

  // Clean the tables
  console.log("Cleaning existing data...");
  await db.delete(comments);
  await db.delete(posts);
  await db.delete(users);

  // Reset the auto-increment counters
  await db.run(
    sql`DELETE FROM sqlite_sequence WHERE name IN ('posts', 'comments', 'users')`,
  );

  console.log("Inserting new seed data...");

  const sampleKeywords = [
    "technology",
    "innovation",
    "design",
    "development",
    "programming",
    "software",
    "hardware",
    "AI",
    "machine learning",
    "data science",
    "cloud computing",
    "cybersecurity",
  ];

  // Create 10 sample users
  const sampleUsers = [];
  for (let i = 1; i <= 10; i++) {
    const user = await db
      .insert(users)
      .values({
        name: faker.person.fullName(),
        username: `user-${i}`,
        password: await hash(`pass-${i}`),
      })
      .returning()
      .get();
    sampleUsers.push(user);
  }

  // Insert 100 sample posts
 // Insert 100 sample posts
for (let i = 1; i <= 100; i++) {
  const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
    min: 1,
    max: 3,
  });
  const content = `Post #${i} ${randomKeywords.join(" ")}`;
  const title = `Title #${i}`; // ✅ Add a title field
  const randomUser = faker.helpers.arrayElement(sampleUsers);

  const post = await db
    .insert(posts)
    .values({
      title, // ✅ Add title here
      content,
      date: faker.date.recent({
        days: 5,
      }),
      userId: randomUser.id,
    })
    .returning()
    .get();

  // Insert 1-50 comments for each post
  const numComments = faker.number.int({ min: 1, max: 50 });
  for (let j = 1; j <= numComments; j++) {
    const randomKeywords = faker.helpers.arrayElements(sampleKeywords, {
      min: 1,
      max: 3,
    });
    const randomCommenter = faker.helpers.arrayElement(sampleUsers);
    await db.insert(comments).values({
      content: `Comment #${j} for post #${i} ${randomKeywords.join(" ")}`,
      date: faker.date.recent({
        days: 3,
      }),
      postId: post.id,
      userId: randomCommenter.id,
    });
  }
}


  console.log("Seeding completed successfully.");
}

seed()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });
