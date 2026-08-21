import Link from "next/link"
import { Folder, FileCode, File, CornerLeftUp } from "lucide-react"

export interface RepoFileItem {
  id: string
  path: string
  filename: string
  isDirectory: boolean
  parentPath: string
  sizeBytes: number
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function FileTreeBrowser({
  slug,
  files = [],
  currentPath = "",
}: {
  slug: string
  files: RepoFileItem[]
  currentPath?: string
}) {
  const parentPathParts = currentPath ? currentPath.split("/") : []
  const hasParent = parentPathParts.length > 0
  const backPath = parentPathParts.slice(0, -1).join("/")

  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-foreground">{slug}</span>
          {currentPath && (
            <>
              <span>/</span>
              <span>{currentPath}</span>
            </>
          )}
        </div>
        <span>{files.length} items</span>
      </div>

      <div className="divide-y divide-border/40 text-sm">
        {hasParent && (
          <Link
            href={
              backPath
                ? `/repo/${slug}?path=${encodeURIComponent(backPath)}`
                : `/repo/${slug}`
            }
            className="flex items-center gap-2.5 px-4 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            <CornerLeftUp className="size-4" />
            <span className="font-mono text-xs">..</span>
          </Link>
        )}

        {files.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            Direktori kosong atau belum ada berkas yang diunggah.
          </div>
        )}

        {files.map((file) => {
          const fileHref = file.isDirectory
            ? `/repo/${slug}?path=${encodeURIComponent(file.path)}`
            : `/repo/${slug}/blob/${file.path}`

          return (
            <Link
              key={file.id}
              href={fileHref}
              className="group flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2.5">
                {file.isDirectory ? (
                  <Folder className="size-4 text-foreground/70 group-hover:text-foreground" />
                ) : file.filename.endsWith(".ts") ||
                  file.filename.endsWith(".tsx") ||
                  file.filename.endsWith(".cpp") ||
                  file.filename.endsWith(".c") ||
                  file.filename.endsWith(".py") ? (
                  <FileCode className="size-4 text-muted-foreground group-hover:text-foreground" />
                ) : (
                  <File className="size-4 text-muted-foreground group-hover:text-foreground" />
                )}
                <span className="font-mono text-xs text-foreground/90 underline-offset-2 group-hover:text-foreground group-hover:underline">
                  {file.filename}
                </span>
              </div>

              {!file.isDirectory && (
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {formatBytes(file.sizeBytes)}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
