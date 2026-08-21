import dotenv from "dotenv"
import path from "path"
import { seedPortfolio } from "./seed-portfolio"
import { seedBlog } from "./seed-blog"
import { seedShop } from "./seed-shop"
import { seedChangelog } from "./seed-changelog"
import { seedArchive } from "./seed-archive"
import { seedSettings } from "./seed-settings"

dotenv.config({ path: path.resolve(__dirname, "../../.env") })
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") })

async function main() {
  console.log("Starting Master Database Seeder...")

  try {
    await seedPortfolio()
    await seedBlog()
    await seedShop()
    await seedChangelog()
    await seedArchive()
    await seedSettings()

    console.log("All Domains Seeded Successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Master Database Seeder Failed:", error)
    process.exit(1)
  }
}

main()
