import Link from "next/link";
import { Header } from "@workspace/ui/components/layouts";

export function AppHeader() {
  return (
    <Header className="absolute top-0 left-0 flex justify-between items-center w-full px-4 py-5">
      <div>
        <Link href="/">Ryzmdn</Link>
      </div>

      <nav className="flex justify-center items-center gap-x-8">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/case-studies">Case Studies</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      <div>
        <Link href="/">Contact</Link>
      </div>
    </Header>
  )
}
