import { createHighlighter, BundledLanguage } from "shiki"

const EXTENSION_LANGUAGE_MAP: Record<string, BundledLanguage> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  c: "c",
  cpp: "cpp",
  py: "python",
  rs: "rust",
  go: "go",
  html: "html",
  css: "css",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
  dockerfile: "dockerfile",
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
        "html",
        "css",
        "sql",
        "bash",
        "markdown",
        "yaml",
        "dockerfile",
        "txt",
      ],
    })
  }
  return highlighterPromise
}

export async function highlightCodeBlock(
  code: string,
  langString?: string
): Promise<string> {
  const langKey = langString?.toLowerCase().trim() || "txt"
  const lang = (EXTENSION_LANGUAGE_MAP[langKey] ||
    ([
      "typescript",
      "tsx",
      "javascript",
      "jsx",
      "json",
      "python",
      "css",
      "html",
      "bash",
      "sql",
      "yaml",
    ].includes(langKey)
      ? langKey
      : "txt")) as BundledLanguage

  const highlighter = await getHighlighter()

  return highlighter.codeToHtml(code.trim(), {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  })
}
