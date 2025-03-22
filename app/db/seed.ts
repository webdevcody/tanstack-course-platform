import "dotenv/config";

async function main() {}

async function seed() {
  console.log("Database seeded!");
}

main();
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
