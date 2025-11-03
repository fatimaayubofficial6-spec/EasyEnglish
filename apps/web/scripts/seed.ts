import connectDB from "../lib/db/mongoose";
import { Paragraph, AdminUser } from "../lib/models";
import { DifficultyLevel, Language, AdminRole } from "../types/models";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Sample Paragraphs
    const sampleParagraphs = [
      {
        title: "The Benefits of Morning Exercise",
        content:
          "Starting your day with exercise can have numerous benefits for both your physical and mental health. Morning workouts help boost your metabolism, improve your mood, and increase your energy levels throughout the day. Studies have shown that people who exercise in the morning are more consistent with their fitness routines and tend to make healthier choices throughout the day. Whether it's a brisk walk, yoga session, or gym workout, making time for morning exercise can transform your daily routine and overall well-being.",
        difficulty: DifficultyLevel.BEGINNER,
        language: Language.ENGLISH,
        topics: ["health", "fitness", "lifestyle"],
        isActive: true,
        metadata: {
          source: "EasyEnglish Editorial Team",
          publicationDate: new Date(),
        },
      },
      {
        title: "The Digital Revolution",
        content:
          "The digital revolution has fundamentally transformed how we communicate, work, and live. From the advent of personal computers to the ubiquity of smartphones, technology has reshaped every aspect of modern society. Social media platforms have connected billions of people across the globe, while artificial intelligence and machine learning are pushing the boundaries of what machines can accomplish. However, this rapid technological advancement also raises important questions about privacy, job displacement, and the digital divide. As we navigate this new landscape, it's crucial to balance innovation with ethical considerations and ensure that technology serves humanity's best interests.",
        difficulty: DifficultyLevel.INTERMEDIATE,
        language: Language.ENGLISH,
        topics: ["technology", "society", "innovation"],
        isActive: true,
        metadata: {
          source: "EasyEnglish Editorial Team",
          publicationDate: new Date(),
        },
      },
      {
        title: "Climate Change and Global Sustainability",
        content:
          "Climate change represents one of the most pressing challenges facing humanity in the 21st century. The overwhelming scientific consensus indicates that human activities, particularly the emission of greenhouse gases, are driving unprecedented changes in global climate patterns. Rising temperatures, melting ice caps, and increasingly severe weather events are just a few manifestations of this crisis. Addressing climate change requires coordinated international action, including transitioning to renewable energy sources, implementing sustainable agricultural practices, and developing innovative technologies for carbon capture and storage. Individual actions, while important, must be complemented by systemic changes in policy, infrastructure, and economic systems to achieve meaningful progress toward a sustainable future.",
        difficulty: DifficultyLevel.ADVANCED,
        language: Language.ENGLISH,
        topics: ["environment", "science", "politics", "sustainability"],
        isActive: true,
        metadata: {
          source: "EasyEnglish Editorial Team",
          publicationDate: new Date(),
        },
      },
      {
        title: "La importancia del aprendizaje de idiomas",
        content:
          "Aprender un nuevo idioma abre puertas a nuevas culturas y oportunidades. No solo mejora tus habilidades cognitivas, sino que también te permite conectar con personas de todo el mundo. El proceso de aprendizaje puede ser desafiante, pero los beneficios a largo plazo son invaluables. Ya sea para viajar, trabajar o simplemente expandir tus horizontes, dominar un segundo idioma es una inversión en tu futuro personal y profesional.",
        difficulty: DifficultyLevel.INTERMEDIATE,
        language: Language.SPANISH,
        topics: ["education", "language", "culture"],
        isActive: true,
        metadata: {
          source: "EasyEnglish Editorial Team",
          publicationDate: new Date(),
        },
      },
      {
        title: "Healthy Eating Habits",
        content:
          "Developing healthy eating habits is essential for maintaining good health and preventing chronic diseases. A balanced diet should include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's important to limit processed foods, sugary drinks, and excessive salt intake. Planning your meals ahead of time and cooking at home can help you make better food choices and control portion sizes. Remember, healthy eating is not about strict limitations but about feeling great, having more energy, and improving your health.",
        difficulty: DifficultyLevel.BEGINNER,
        language: Language.ENGLISH,
        topics: ["health", "nutrition", "lifestyle"],
        isActive: true,
        metadata: {
          source: "EasyEnglish Editorial Team",
          publicationDate: new Date(),
        },
      },
    ];

    // Clear existing paragraphs (optional - remove if you want to keep existing data)
    await Paragraph.deleteMany({});
    console.log("🗑️  Cleared existing paragraphs");

    // Insert sample paragraphs
    const insertedParagraphs = await Paragraph.insertMany(sampleParagraphs);
    console.log(`✅ Inserted ${insertedParagraphs.length} sample paragraphs`);

    // Sample Admin User
    // NOTE: Replace this userId with an actual user ID from your database
    // You can find user IDs by checking the users collection after signing in
    const sampleAdminUserId = "REPLACE_WITH_ACTUAL_USER_ID";

    console.log("\n⚠️  Admin User Setup:");
    console.log(
      "To create an admin user, you need to replace 'REPLACE_WITH_ACTUAL_USER_ID' in scripts/seed.ts"
    );
    console.log("with an actual user ID from your database.");
    console.log("\nSteps to create an admin user:");
    console.log("1. Sign in to the application using Google OAuth");
    console.log("2. Check your MongoDB users collection to find your user ID");
    console.log("3. Update the sampleAdminUserId in scripts/seed.ts");
    console.log("4. Run the seed script again");

    if (sampleAdminUserId !== "REPLACE_WITH_ACTUAL_USER_ID") {
      await AdminUser.deleteMany({ userId: sampleAdminUserId });
      const adminUser = await AdminUser.create({
        userId: sampleAdminUserId,
        role: AdminRole.SUPER_ADMIN,
        permissions: ["manage_users", "manage_content", "manage_admins", "view_analytics"],
        notes: "Initial admin user created via seed script",
        isActive: true,
      });
      console.log(`✅ Created admin user: ${adminUser._id}`);
    }

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
