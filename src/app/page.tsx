// import { ModeToggle } from "@/components/common/mode-toggle";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center">
//       <h1 className="text-3xl font-bold">Hello, world!</h1>
//       <ModeToggle />
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return null;
}
