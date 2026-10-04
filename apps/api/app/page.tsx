import { ApiPortalClient } from "@/components/portal/api-portal-client";

export const metadata = {
  title: "Rizfolio Developer Gateway — Unified REST API",
  description:
    "Explore, test, and integrate with the core high-performance REST API powering the Rizfolio monorepo ecosystem. Complete with interactive playground and OpenAPI 3.1 documentation.",
};

export default function ApiDeveloperPortalPage() {
  return <ApiPortalClient />;
}
