const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

function loadEnvLocal() {
  const envFile = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envFile)) {
    throw new Error(".env.local not found");
  }
  fs.readFileSync(envFile, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    });
}

async function main() {
  loadEnvLocal();

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const hash = await bcrypt.hash(password, 12);
  const admins = mongoose.connection.collection("admins");

  const existing = await admins.findOne({ email });
  if (existing) {
    await admins.updateOne({ email }, { $set: { password: hash, updatedAt: new Date() } });
    console.log(`Updated admin password for ${email}`);
  } else {
    await admins.insertOne({
      email,
      password: hash,
      name: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`Created admin account for ${email}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
