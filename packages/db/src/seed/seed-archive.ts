import {
  db,
  repositories,
  repoFiles,
  repoReleases,
} from "../index"

export async function seedArchive() {
  console.log("Seeding Archive Domain...")

  await db.delete(repoReleases)
  await db.delete(repoFiles)
  await db.delete(repositories)

  const r1 = await db
    .insert(repositories)
    .values({
      name: "Distributed Cache Node",
      slug: "distributed-cache-node",
      description:
        "High-performance distributed in-memory LRU caching node with consistent hashing ring and gossip failure detection.",
      category: "ASSIGNMENT",
      courseName: "Distributed Systems Architecture",
      semester: "Fall 2024",
      techStack: ["Go", "gRPC", "Protobuf", "Docker"],
      githubUrl: "https://github.com/ryzmdn/distributed-cache-node",
      demoUrl: "https://cache-node.example.com",
      license: "MIT",
      starsCount: 42,
      viewsCount: 680,
      downloadsCount: 35,
      readmeContent: `# Distributed Cache Node

An experimental distributed caching node implementing consistent hashing and virtual ring replication.

## Key Features

- **Consistent Hashing**: Minimizes key re-distribution upon node churn.
- **Gossip Protocol**: Decentralized cluster membership and heartbeat failure detection.
- **gRPC Transports**: High-throughput RPC communication between shards.
`,
      isPublic: true,
    })
    .returning()

  await db
    .insert(repositories)
    .values({
      name: "OKLCH Theme Generator",
      slug: "oklch-theme-generator",
      description:
        "Zero-dependency algorithmic palette generator calculating harmonious OKLCH color palettes with WCAG AAA contrast parity.",
      category: "EXPERIMENT",
      courseName: "Human-Computer Interaction",
      semester: "Spring 2025",
      techStack: ["TypeScript", "Tailwind CSS v4", "React 19"],
      githubUrl: "https://github.com/ryzmdn/oklch-theme-generator",
      demoUrl: "https://oklch-theme.example.com",
      license: "MIT",
      starsCount: 88,
      viewsCount: 1240,
      downloadsCount: 92,
      readmeContent: `# OKLCH Theme Generator

Algorithmic palette generator for Next.js and Tailwind CSS v4 design systems.
`,
      isPublic: true,
    })
    .returning()

  const repo1 = r1[0]
  if (repo1) {
    await db.insert(repoFiles).values([
      {
        repoId: repo1.id,
        path: "README.md",
        filename: "README.md",
        isDirectory: false,
        parentPath: "",
        sizeBytes: 1024,
        contentText: repo1.readmeContent || "",
      },
      {
        repoId: repo1.id,
        path: "go.mod",
        filename: "go.mod",
        isDirectory: false,
        parentPath: "",
        sizeBytes: 180,
        contentText: `module github.com/ryzmdn/distributed-cache-node\n\ngo 1.23\n\nrequire (\n\tgoogle.golang.org/grpc v1.65.0\n\tgoogle.golang.org/protobuf v1.34.2\n)\n`,
      },
      {
        repoId: repo1.id,
        path: "src",
        filename: "src",
        isDirectory: true,
        parentPath: "",
        sizeBytes: 0,
      },
      {
        repoId: repo1.id,
        path: "src/main.go",
        filename: "main.go",
        isDirectory: false,
        parentPath: "src",
        sizeBytes: 850,
        contentText: `package main\n\nimport (\n\t"fmt"\n\t"log"\n\t"net"\n)\n\nfunc main() {\n\tfmt.Println("Starting distributed cache node on port 8080...")\n\tlis, err := net.Listen("tcp", ":8080")\n\tif err != nil {\n\t\tlog.Fatalf("failed to listen: %v", err)\n\t}\n\tdefer lis.Close()\n}\n`,
      },
    ])

    await db.insert(repoReleases).values({
      repoId: repo1.id,
      versionTag: "v1.0.0",
      zipStoragePath: "archives/distributed-cache-node-v1.0.0.zip",
      changelog: "Initial stable release of distributed cache node.",
    })
  }

  console.log("Archive Domain Seeded Successfully.")
}
