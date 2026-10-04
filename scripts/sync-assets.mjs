import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const sharedPublicDir = path.join(rootDir, "public")
const appsDir = path.join(rootDir, "apps")
const MANIFEST_NAME = ".shared-assets-manifest.json"

function getAppPublicDirs() {
  if (!fs.existsSync(appsDir)) return []
  return fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((appName) => {
      const appPkg = path.join(appsDir, appName, "package.json")
      return fs.existsSync(appPkg)
    })
    .map((appName) => ({
      name: appName,
      publicDir: path.join(appsDir, appName, "public"),
    }))
}

function getAllFiles(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, baseDir))
    } else if (entry.isFile()) {
      if (entry.name !== MANIFEST_NAME && !entry.name.endsWith(".tmp")) {
        const relativePath = path
          .relative(baseDir, fullPath)
          .replace(/\\/g, "/")
        files.push(relativePath)
      }
    }
  }

  return files
}

function shouldCopy(srcPath, destPath) {
  if (!fs.existsSync(destPath)) return true
  const srcStat = fs.statSync(srcPath)
  const destStat = fs.statSync(destPath)
  if (srcStat.size !== destStat.size) return true
  return srcStat.mtimeMs > destStat.mtimeMs
}

export function syncSharedAssets(options = {}) {
  const silent = options.silent || false

  if (!fs.existsSync(sharedPublicDir)) {
    fs.mkdirSync(sharedPublicDir, { recursive: true })
    fs.mkdirSync(path.join(sharedPublicDir, "logos"), { recursive: true })
    fs.mkdirSync(path.join(sharedPublicDir, "media"), { recursive: true })
    fs.mkdirSync(path.join(sharedPublicDir, "icons"), { recursive: true })
    fs.mkdirSync(path.join(sharedPublicDir, "brand"), { recursive: true })
  }

  const appTargets = getAppPublicDirs()
  if (appTargets.length === 0) {
    if (!silent) console.log("[assets-sync] No target apps found in apps/.")
    return
  }

  const sourceFiles = getAllFiles(sharedPublicDir)
  let copiedCount = 0
  let removedCount = 0

  for (const { name: appName, publicDir } of appTargets) {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    const manifestPath = path.join(publicDir, MANIFEST_NAME)
    let previousManifest = []
    if (fs.existsSync(manifestPath)) {
      try {
        previousManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))
      } catch {
        previousManifest = []
      }
    }

    const currentFiles = []

    for (const relPath of sourceFiles) {
      const srcFile = path.join(sharedPublicDir, relPath)
      const destFile = path.join(publicDir, relPath)
      const destDir = path.dirname(destFile)

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }

      if (shouldCopy(srcFile, destFile)) {
        fs.copyFileSync(srcFile, destFile)
        copiedCount++
      }

      currentFiles.push(relPath)
    }

    for (const prevRelPath of previousManifest) {
      if (!sourceFiles.includes(prevRelPath)) {
        const obsoleteFile = path.join(publicDir, prevRelPath)
        if (fs.existsSync(obsoleteFile)) {
          fs.unlinkSync(obsoleteFile)
          removedCount++
        }
      }
    }

    fs.writeFileSync(
      manifestPath,
      JSON.stringify(currentFiles, null, 2),
      "utf-8"
    )
  }

  if (!silent) {
    const appNames = appTargets.map((a) => a.name).join(", ")
    console.log(
      `[assets-sync] Synced ${sourceFiles.length} shared asset(s) to ${appTargets.length} apps (${appNames}). Copied: ${copiedCount}, Cleaned: ${removedCount}`
    )
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const isWatch = process.argv.includes("--watch")

  syncSharedAssets()

  if (isWatch) {
    console.log(
      `[assets-sync] Watching for asset changes in ${path.relative(rootDir, sharedPublicDir)}...`
    )
    let debounceTimer = null

    fs.watch(sharedPublicDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.includes(MANIFEST_NAME)) return
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        console.log(
          `[assets-sync] File change detected (${filename || "unknown"}). Syncing...`
        )
        syncSharedAssets({ silent: false })
      }, 100)
    })
  }
}
