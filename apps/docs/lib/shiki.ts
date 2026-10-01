import { createHighlighter, BundledLanguage } from "shiki"

const EXTENSION_LANGUAGE_MAP: Record<string, BundledLanguage> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  c: "c",
  cpp: "cpp",
  h: "c",
  hpp: "cpp",
  py: "python",
  rs: "rust",
  go: "go",
  java: "java",
  html: "html",
  css: "css",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  md: "markdown",
  markdown: "markdown",
  yaml: "yaml",
  yml: "yaml",
  dockerfile: "dockerfile",
  makefile: "makefile",
}

export function detectLanguage(filename: string): BundledLanguage | "txt" {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  return EXTENSION_LANGUAGE_MAP[ext] || "txt"
}

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: [
        "typescript",
        "tsx",
        "javascript",
        "jsx",
        "json",
        "c",
        "cpp",
        "python",
        "rust",
        "go",
        "java",
        "html",
        "css",
        "sql",
        "bash",
        "markdown",
        "yaml",
        "dockerfile",
        "makefile",
        "txt",
      ],
    })
  }
  return highlighterPromise
}

export async function highlightCode(
  code: string,
  filename: string
): Promise<string> {
  const lang = detectLanguage(filename)
  const highlighter = await getHighlighter()

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  })
}
