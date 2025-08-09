import { prisma } from "./index";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@getitdone.dev" },
    update: {},
    create: {
      email: "demo@getitdone.dev",
      name: "Demo User",
      timezone: "America/Edmonton",
      phoneE164: "+15875550123",
      phoneVerified: false
    }
  });

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title: "Weekly standup",
      notes: "Prepare notes and action items",
      priority: "MED",
      labels: ["work"]
    }
  });

  await prisma.reminderRule.create({
    data: {
      taskId: task.id,
      type: "RECURRING",
      rrule: "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0",
      channels: ["EMAIL", "SMS"],
      offsetMinutes: -30
    }
  });
}

main().then(() => {
  console.log("Seeded!");
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
