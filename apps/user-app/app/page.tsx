import { PrismaClient } from "@repo/db/client";

const prisma = new PrismaClient();

export default function Home() {
  return (
    <div className="text-4xs">
      hi there !!
    </div>
  );
}
