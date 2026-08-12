export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="container-default"
      className="w-full max-w-none min-w-xs bg-transparent p-0 m-0"
    >
      <section
        id="section-default"
        className="mx-auto w-full max-w-7xl bg-transparent px-4 sm:px-6 lg:px-8"
      >
        {children}
      </section>
    </div>
  )
}
