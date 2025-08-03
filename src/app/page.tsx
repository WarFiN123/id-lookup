import { Suspense } from "react";
import PageClient from "./client";

export default function Page() {
  return (
    <Suspense>
      <PageClient />
    </Suspense>
  );
}