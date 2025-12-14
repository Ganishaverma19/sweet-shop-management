import bcrypt from "bcrypt";
import prisma from "./lib/prisma";

async function main() {
  const hash = await bcrypt.hash("123456", 10);

  await prisma.user.update({
    where: { email: "fixed@test.com" },
    data: { password: hash },
  });

  console.log("Password reset done");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
