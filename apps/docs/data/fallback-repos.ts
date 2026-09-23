export interface FallbackRepository {
  id: string
  slug: string
  name: string
  description: string
  category: "ASSIGNMENT" | "EXPERIMENT" | "OPEN_SOURCE"
  courseName?: string | null
  semester?: string | null
  techStack: string[]
  githubUrl?: string | null
  demoUrl?: string | null
  license: string
  starsCount: number
  viewsCount: number
  downloadsCount: number
  readmeContent: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FallbackRepoFile {
  id: string
  repoId: string
  path: string
  filename: string
  isDirectory: boolean
  parentPath: string
  sizeBytes: number
  contentText: string | null
  storageUrl?: string | null
}

export interface FallbackRepoRelease {
  id: string
  repoId: string
  versionTag: string
  zipStoragePath: string
  changelog: string
  createdAt: Date
}

const README_DIST_CACHE = `# Distributed Cache Node

An in-memory, partition-tolerant distributed cache node designed for low-latency key-value storage. Implements consistent hashing with virtual nodes to minimize re-sharding overhead and utilizes a decentralized gossip membership protocol for automatic node discovery.

## Architectural Overview

\`\`\`
Client Request -> Hash Ring Lookup -> Shard Leader (gRPC) -> In-Memory LRU
                      |
           Gossip Heartbeat Protocol (UDP)
                      |
               Peer Replicas (Sync)
\`\`\`

### Core Components

1. **Consistent Hashing Ring**: Employs a 32-bit CRC hash ring with 150 virtual nodes per physical instance to ensure uniform key distribution across cluster boundaries.
2. **Gossip Protocol**: Periodic UDP heartbeats evaluate node reachability with adjustable suspicion intervals, preventing split-brain states during transient network partitions.
3. **gRPC Interface**: High-throughput multiplexed RPC endpoints provide sub-millisecond retrieval and mutation operations with protocol buffers serialization.
4. **LRU Eviction Engine**: Thread-safe doubly-linked list with hash map indexing, guaranteeing O(1) reads, updates, and memory-bounded evictions.

## Benchmarks

- **Throughput**: 120,000 requests/sec per shard (single m6i.xlarge node).
- **p99 Latency**: 0.42ms on local VPC networks.
- **Failover Convergence**: Under 1.2 seconds across 7 cluster nodes.

## Build and Run

\`\`\`bash
# Build binary
go build -o bin/cache-node src/main.go

# Start primary node
./bin/cache-node --port=8080 --peers="10.0.0.2:8080,10.0.0.3:8080"
\`\`\`
`

const README_OKLCH_THEME = `# OKLCH Algorithmic Theme Engine

An algorithmic color design tool engineered to solve perceptual non-uniformity in digital interfaces. Built on the OKLCH color space, this library derives complete 10-step tonal scales, dark mode inversions, and high-contrast accessible tokens with zero manual tweaking.

## Why OKLCH?

Traditional HSL scales exhibit acute perceptual unevenness: pure yellow (hue 60°) produces significantly higher perceived luminance than pure blue (hue 240°), compromising accessible contrast calculations across design tokens. OKLCH aligns lightness and chroma with human ocular perception.

## Key Features

- **Perceptual Uniformity**: Constant lightness curves ensure WCAG 2.2 and APCA contrast targets are preserved across every generated hue.
- **Gamut Mapping**: Automatic fallback boundary clamping from P3 wide color into sRGB space without hue-shifting artifacts.
- **Design Token Export**: Generates copy-paste ready CSS variables for Tailwind CSS v4 and vanilla CSS token sheets.
- **Zero Runtime Dependencies**: Ultra-lightweight pure TypeScript math engine (<4KB minified).

## Quickstart

\`\`\`typescript
import { generateTonalPalette, checkAPCAContrast } from "@/lib/palette";

const primary = generateTonalPalette({
  hue: 250,
  chroma: 0.18,
  steps: 10,
});

console.log(primary[500].css); // "oklch(0.62 0.18 250)"
\`\`\`
`

const README_KERNEL_ALLOC = `# Virtual Memory & Slab Allocator

A minimal kernel-space memory management subsystem engineered in C. Combines a binary buddy page allocator for managing physical frame allocations with an object-caching slab allocator for fine-grained kernel structures.

## Allocation Hierarchy

\`\`\`
Physical RAM (Pages of 4096 bytes)
              |
      [Buddy Allocator] (Order 0 to Order 10)
              |
      [Slab Cache Layer] (32B, 64B, 128B, 256B, 512B)
              |
       Kernel Objects (Task structs, Inodes, File descriptors)
\`\`\`

## Architecture & Design Decisions

1. **Buddy System**: Coalesces adjacent power-of-two page frames immediately on deallocation, eliminating external fragmentation while keeping allocation latency bounded.
2. **Slab Cache Recycling**: Pre-allocates contiguous memory blocks divided into fixed-size slots, avoiding repetitive zeroing and constructor invocations.
3. **Lockless CPU Free-Lists**: Thread-local free lists minimize lock contention in multi-threaded simulation environments.

## Verification & Tests

Tested using a synthetic microbenchmark allocating and releasing 500,000 randomized objects up to 4096 bytes. Memory overhead remained within 3.4% of total allocated capacity.

\`\`\`bash
# Compile and run test suite
make all
./bin/allocator_test
\`\`\`
`

const README_TURBO_STARTER = `# Full-Stack Monorepo Starter

An enterprise-ready monorepo template built for high-velocity full-stack engineering teams. Powered by Turborepo, pnpm workspaces, Next.js 16, and Drizzle ORM, with absolute boundary isolation between business applications and shared infrastructure.

## Monorepo Layout

\`\`\`
apps/
  ├── web/          # Public-facing web application (Next.js 16 App Router)
  ├── docs/         # Documentation & API explorer
packages/
  ├── ui/           # Shared design system components (Tailwind v4)
  ├── db/           # Drizzle ORM schema, migrations, and database client
  ├── tsconfig/     # Unified strict TypeScript configurations
  └── eslint/       # Flat ESLint configurations
\`\`\`

## Principles

- **Zero Circular Dependencies**: Internal packages never import application code; apps only depend downward on packages.
- **Shared Type Safety**: Database schemas defined in \`@workspace/db\` propagate types directly into UI components.
- **Turbopack Acceleration**: Sub-second local builds and incremental task cache verification.
`

export const fallbackRepositories: FallbackRepository[] = [
  {
    id: "repo-1-dist-cache",
    slug: "distributed-cache-node",
    name: "Distributed Cache Node",
    description:
      "High-performance distributed in-memory LRU caching node with consistent hashing ring and gossip failure detection.",
    category: "ASSIGNMENT",
    courseName: "Distributed Systems Architecture",
    semester: "Semester 5",
    techStack: ["Go", "gRPC", "Protobuf", "Docker"],
    githubUrl: "https://github.com/ryzmdn/distributed-cache-node",
    demoUrl: "https://cache.rizkyramadhan.dev",
    license: "MIT",
    starsCount: 48,
    viewsCount: 840,
    downloadsCount: 42,
    isPublic: true,
    createdAt: new Date("2024-10-12T08:00:00Z"),
    updatedAt: new Date("2024-11-20T14:30:00Z"),
    readmeContent: README_DIST_CACHE,
  },
  {
    id: "repo-2-oklch-theme",
    slug: "oklch-theme-generator",
    name: "OKLCH Algorithmic Theme Engine",
    description:
      "Algorithmic palette generator calculating harmonious OKLCH color palettes with WCAG AAA and APCA contrast parity.",
    category: "EXPERIMENT",
    courseName: "Human-Computer Interaction",
    semester: "Semester 6",
    techStack: ["TypeScript", "Tailwind CSS v4", "React 19"],
    githubUrl: "https://github.com/ryzmdn/oklch-theme-generator",
    demoUrl: "https://oklch.rizkyramadhan.dev",
    license: "MIT",
    starsCount: 112,
    viewsCount: 1680,
    downloadsCount: 95,
    isPublic: true,
    createdAt: new Date("2025-01-15T10:00:00Z"),
    updatedAt: new Date("2025-02-18T16:45:00Z"),
    readmeContent: README_OKLCH_THEME,
  },
  {
    id: "repo-3-kernel-alloc",
    slug: "os-kernel-allocator",
    name: "Virtual Memory & Slab Allocator",
    description:
      "Kernel-space buddy memory allocator and slab cache manager designed for low-overhead page frames and object reuse.",
    category: "ASSIGNMENT",
    courseName: "Operating Systems & Low-Level Architecture",
    semester: "Semester 4",
    techStack: ["C", "Assembly", "Makefile", "POSIX"],
    githubUrl: "https://github.com/ryzmdn/os-kernel-allocator",
    demoUrl: null,
    license: "GPL-3.0",
    starsCount: 36,
    viewsCount: 620,
    downloadsCount: 28,
    isPublic: true,
    createdAt: new Date("2024-03-05T09:15:00Z"),
    updatedAt: new Date("2024-04-22T11:20:00Z"),
    readmeContent: README_KERNEL_ALLOC,
  },
  {
    id: "repo-4-turbo-starter",
    slug: "turborepo-next-starter",
    name: "Full-Stack Monorepo Starter",
    description:
      "Enterprise-grade Next.js 16 and Turborepo starter blueprint with strict workspace boundaries, Drizzle ORM, and shared UI tokens.",
    category: "OPEN_SOURCE",
    courseName: null,
    semester: null,
    techStack: ["Next.js", "Turborepo", "Drizzle ORM", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/ryzmdn/turborepo-next-starter",
    demoUrl: "https://starter.rizkyramadhan.dev",
    license: "MIT",
    starsCount: 240,
    viewsCount: 3150,
    downloadsCount: 180,
    isPublic: true,
    createdAt: new Date("2024-08-01T12:00:00Z"),
    updatedAt: new Date("2025-02-10T18:00:00Z"),
    readmeContent: README_TURBO_STARTER,
  },
]

export const fallbackRepoFiles: FallbackRepoFile[] = [
  {
    id: "file-1-readme",
    repoId: "repo-1-dist-cache",
    path: "README.md",
    filename: "README.md",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 1540,
    contentText: README_DIST_CACHE,
  },
  {
    id: "file-1-gomod",
    repoId: "repo-1-dist-cache",
    path: "go.mod",
    filename: "go.mod",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 240,
    contentText: `module github.com/ryzmdn/distributed-cache-node

go 1.23

require (
	google.golang.org/grpc v1.65.0
	google.golang.org/protobuf v1.34.2
	golang.org/x/sync v0.8.0
)
`,
  },
  {
    id: "file-1-docker",
    repoId: "repo-1-dist-cache",
    path: "Dockerfile",
    filename: "Dockerfile",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 420,
    contentText: `FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /bin/cache-node src/main.go

FROM scratch
COPY --from=builder /bin/cache-node /bin/cache-node
EXPOSE 8080 7946/udp
ENTRYPOINT ["/bin/cache-node"]
`,
  },
  {
    id: "file-1-dir-src",
    repoId: "repo-1-dist-cache",
    path: "src",
    filename: "src",
    isDirectory: true,
    parentPath: "",
    sizeBytes: 0,
    contentText: null,
  },
  {
    id: "file-1-src-main",
    repoId: "repo-1-dist-cache",
    path: "src/main.go",
    filename: "main.go",
    isDirectory: false,
    parentPath: "src",
    sizeBytes: 1350,
    contentText: `package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	port := flag.Int("port", 8080, "TCP port for gRPC listener")
	gossipPort := flag.Int("gossip-port", 7946, "UDP port for gossip peer detection")
	flag.Parse()

	fmt.Printf("Starting Distributed Cache Node on port %d (Gossip UDP: %d)\\n", *port, *gossipPort)

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen on port %d: %v", *port, err)
	}
	defer lis.Close()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	fmt.Println("Shutting down cache node cleanly...")
}
`,
  },
  {
    id: "file-1-src-cache",
    repoId: "repo-1-dist-cache",
    path: "src/cache.go",
    filename: "cache.go",
    isDirectory: false,
    parentPath: "src",
    sizeBytes: 1680,
    contentText: `package main

import (
	"container/list"
	"sync"
)

type LRUCache struct {
	mu         sync.RWMutex
	capacity   int
	items      map[string]*list.Element
	evictList  *list.List
}

type entry struct {
	key   string
	value []byte
}

func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{
		capacity:  capacity,
		items:     make(map[string]*list.Element),
		evictList: list.New(),
	}
}

func (c *LRUCache) Get(key string) ([]byte, bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if elem, ok := c.items[key]; ok {
		c.evictList.MoveToFront(elem)
		return elem.Value.(*entry).value, true
	}
	return nil, false
}

func (c *LRUCache) Set(key string, val []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if elem, ok := c.items[key]; ok {
		c.evictList.MoveToFront(elem)
		elem.Value.(*entry).value = val
		return
	}

	elem := c.evictList.PushFront(&entry{key: key, value: val})
	c.items[key] = elem

	if c.evictList.Len() > c.capacity {
		oldest := c.evictList.Back()
		if oldest != nil {
			c.evictList.Remove(oldest)
			delete(c.items, oldest.Value.(*entry).key)
		}
	}
}
`,
  },
  {
    id: "file-1-src-ring",
    repoId: "repo-1-dist-cache",
    path: "src/ring.go",
    filename: "ring.go",
    isDirectory: false,
    parentPath: "src",
    sizeBytes: 1420,
    contentText: `package main

import (
	"hash/crc32"
	"sort"
	"strconv"
	"sync"
)

type HashRing struct {
	mu       sync.RWMutex
	vnodes   int
	ring     []uint32
	nodeMap  map[uint32]string
}

func NewHashRing(vnodes int) *HashRing {
	return &HashRing{
		vnodes:  vnodes,
		ring:    make([]uint32, 0),
		nodeMap: make(map[uint32]string),
	}
}

func (h *HashRing) AddNode(node string) {
	h.mu.Lock()
	defer h.mu.Unlock()

	for i := 0; i < h.vnodes; i++ {
		hash := crc32.ChecksumIEEE([]byte(node + "#" + strconv.Itoa(i)))
		h.ring = append(h.ring, hash)
		h.nodeMap[hash] = node
	}
	sort.Slice(h.ring, func(i, j int) bool { return h.ring[i] < h.ring[j] })
}

func (h *HashRing) GetNode(key string) string {
	h.mu.RLock()
	defer h.mu.RUnlock()

	if len(h.ring) == 0 {
		return ""
	}

	hash := crc32.ChecksumIEEE([]byte(key))
	idx := sort.Search(len(h.ring), func(i int) bool {
		return h.ring[i] >= hash
	})

	if idx == len(h.ring) {
		idx = 0
	}
	return h.nodeMap[h.ring[idx]]
}
`,
  },
  {
    id: "file-2-readme",
    repoId: "repo-2-oklch-theme",
    path: "README.md",
    filename: "README.md",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 1320,
    contentText: README_OKLCH_THEME,
  },
  {
    id: "file-2-pkg",
    repoId: "repo-2-oklch-theme",
    path: "package.json",
    filename: "package.json",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 520,
    contentText: `{
  "name": "@ryzmdn/oklch-theme-generator",
  "version": "0.4.2",
  "description": "Algorithmic OKLCH color palette generator with WCAG AAA & APCA contrast calculation",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
`,
  },
  {
    id: "file-2-dir-src",
    repoId: "repo-2-oklch-theme",
    path: "src",
    filename: "src",
    isDirectory: true,
    parentPath: "",
    sizeBytes: 0,
    contentText: null,
  },
  {
    id: "file-2-src-palette",
    repoId: "repo-2-oklch-theme",
    path: "src/palette.ts",
    filename: "palette.ts",
    isDirectory: false,
    parentPath: "src",
    sizeBytes: 1580,
    contentText: `export interface OKLCHColor {
  l: number // Lightness [0, 1]
  c: number // Chroma [0, 0.4]
  h: number // Hue [0, 360]
}

export interface TonalScale {
  [step: number]: {
    oklch: OKLCHColor
    css: string
    hex: string
  }
}

export function generateTonalPalette(base: OKLCHColor): TonalScale {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  const lightnessMap: Record<number, number> = {
    50: 0.97,
    100: 0.93,
    200: 0.85,
    300: 0.76,
    400: 0.67,
    500: base.l,
    600: 0.52,
    700: 0.42,
    800: 0.31,
    900: 0.22,
    950: 0.14,
  }

  const result: TonalScale = {}

  for (const step of steps) {
    const targetL = lightnessMap[step]
    // Dynamic chroma scaling to prevent out-of-gamut clipping
    const chromaFactor = Math.sin((targetL) * Math.PI)
    const targetC = Math.min(base.c, base.c * chromaFactor * 1.2)

    result[step] = {
      oklch: { l: targetL, c: targetC, h: base.h },
      css: \`oklch(\${targetL.toFixed(3)} \${targetC.toFixed(3)} \${base.h.toFixed(1)})\`,
      hex: "#mockhex",
    }
  }

  return result
}
`,
  },
  {
    id: "file-2-src-contrast",
    repoId: "repo-2-oklch-theme",
    path: "src/contrast.ts",
    filename: "contrast.ts",
    isDirectory: false,
    parentPath: "src",
    sizeBytes: 1100,
    contentText: `export function calculateWCAGContrast(l1: number, l2: number): number {
  const y1 = l1 > l2 ? l1 : l2
  const y2 = l1 > l2 ? l2 : l1
  return (y1 + 0.05) / (y2 + 0.05)
}

export function meetsWCAGAA(contrastRatio: number, isLargeText = false): boolean {
  return isLargeText ? contrastRatio >= 3.0 : contrastRatio >= 4.5
}

export function meetsWCAGAAA(contrastRatio: number, isLargeText = false): boolean {
  return isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7.0
}
`,
  },

  {
    id: "file-3-readme",
    repoId: "repo-3-kernel-alloc",
    path: "README.md",
    filename: "README.md",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 1450,
    contentText: README_KERNEL_ALLOC,
  },
  {
    id: "file-3-makefile",
    repoId: "repo-3-kernel-alloc",
    path: "Makefile",
    filename: "Makefile",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 380,
    contentText: `CC = gcc
CFLAGS = -Wall -Wextra -O2 -std=c11 -Iinclude
SRC = src/allocator.c src/slab.c
OBJ = $(SRC:.c=.o)
TARGET = bin/allocator_test

all: $(TARGET)

$(TARGET): $(OBJ)
	@mkdir -p bin
	$(CC) $(CFLAGS) -o $@ $^

clean:
	rm -f src/*.o $(TARGET)
`,
  },
  {
    id: "file-3-dir-include",
    repoId: "repo-3-kernel-alloc",
    path: "include",
    filename: "include",
    isDirectory: true,
    parentPath: "",
    sizeBytes: 0,
    contentText: null,
  },
  {
    id: "file-3-include-h",
    repoId: "repo-3-kernel-alloc",
    path: "include/allocator.h",
    filename: "allocator.h",
    isDirectory: false,
    parentPath: "include",
    sizeBytes: 890,
    contentText: `#ifndef ALLOCATOR_H
#define ALLOCATOR_H

#include <stddef.h>
#include <stdint.h>

#define PAGE_SIZE 4096
#define MAX_ORDER 10

typedef struct page {
    uint32_t flags;
    uint32_t order;
    struct page *next;
    struct page *prev;
} page_t;

void buddy_init(void *memory_pool, size_t pool_size);
page_t *buddy_alloc_pages(uint32_t order);
void buddy_free_pages(page_t *pages, uint32_t order);

void *kmem_cache_alloc(size_t size);
void kmem_cache_free(void *ptr);

#endif
`,
  },
  {
    id: "file-3-dir-src",
    repoId: "repo-3-kernel-alloc",
    path: "src",
    filename: "src",
    isDirectory: true,
    parentPath: "",
    sizeBytes: 0,
    contentText: null,
  },
  {
    id: "file-3-src-c",
    repoId: "repo-3-kernel-alloc",
    path: "src/allocator.c",
    filename: "allocator.c",
    isDirectory: false,
    parentPath: "src",
    sizeBytes: 1650,
    contentText: `#include "allocator.h"
#include <stdio.h>
#include <string.h>

static page_t *free_lists[MAX_ORDER + 1];

void buddy_init(void *memory_pool, size_t pool_size) {
    memset(free_lists, 0, sizeof(free_lists));
    printf("[Kernel Allocator] Initialized with %zu bytes at %p\\n", pool_size, memory_pool);
}

page_t *buddy_alloc_pages(uint32_t order) {
    if (order > MAX_ORDER) return NULL;

    for (uint32_t current_order = order; current_order <= MAX_ORDER; current_order++) {
        if (free_lists[current_order] != NULL) {
            page_t *allocated = free_lists[current_order];
            free_lists[current_order] = allocated->next;

            // Split buddy blocks down to target order
            while (current_order > order) {
                current_order--;
                page_t *buddy = allocated + (1 << current_order);
                buddy->order = current_order;
                buddy->next = free_lists[current_order];
                free_lists[current_order] = buddy;
            }

            allocated->order = order;
            return allocated;
        }
    }
    return NULL;
}
`,
  },

  {
    id: "file-4-readme",
    repoId: "repo-4-turbo-starter",
    path: "README.md",
    filename: "README.md",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 1480,
    contentText: README_TURBO_STARTER,
  },
  {
    id: "file-4-turbo",
    repoId: "repo-4-turbo-starter",
    path: "turbo.json",
    filename: "turbo.json",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 420,
    contentText: `{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
`,
  },
  {
    id: "file-4-pkg",
    repoId: "repo-4-turbo-starter",
    path: "package.json",
    filename: "package.json",
    isDirectory: false,
    parentPath: "",
    sizeBytes: 480,
    contentText: `{
  "name": "turborepo-next-starter",
  "private": true,
  "packageManager": "pnpm@11.6.0",
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck"
  },
  "devDependencies": {
    "turbo": "^2.4.0",
    "prettier": "^3.5.0"
  }
}
`,
  },
]

export const fallbackRepoReleases: FallbackRepoRelease[] = [
  {
    id: "rel-1",
    repoId: "repo-1-dist-cache",
    versionTag: "v1.0.0",
    zipStoragePath: "releases/distributed-cache-node-v1.0.0.zip",
    changelog: "Initial production release of distributed cache node with consistent hash ring and gossip protocol.",
    createdAt: new Date("2024-11-20T14:30:00Z"),
  },
  {
    id: "rel-2",
    repoId: "repo-2-oklch-theme",
    versionTag: "v0.4.2",
    zipStoragePath: "releases/oklch-theme-generator-v0.4.2.zip",
    changelog: "Added APCA contrast computation algorithm and dynamic chroma boundary fallback.",
    createdAt: new Date("2025-02-18T16:45:00Z"),
  },
  {
    id: "rel-3",
    repoId: "repo-3-kernel-alloc",
    versionTag: "v1.2.0",
    zipStoragePath: "releases/os-kernel-allocator-v1.2.0.zip",
    changelog: "Slab cache object alignment optimization and thread-safe lockless free list.",
    createdAt: new Date("2024-04-22T11:20:00Z"),
  },
  {
    id: "rel-4",
    repoId: "repo-4-turbo-starter",
    versionTag: "v2.0.0",
    zipStoragePath: "releases/turborepo-next-starter-v2.0.0.zip",
    changelog: "Upgraded Next.js to v16, Tailwind CSS to v4, and React 19.",
    createdAt: new Date("2025-02-10T18:00:00Z"),
  },
]
