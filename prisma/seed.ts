import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const cars = [
    { year: 2020, model: "Toyota Camry", dailyRate: 50.0, available: true },
    { year: 2019, model: "Honda Civic", dailyRate: 45.0, available: true },
    { year: 2021, model: "Ford Mustang", dailyRate: 70.0, available: false },
    { year: 2020, model: "Chevrolet Malibu", dailyRate: 60.0, available: true },
    { year: 2022, model: "Tesla Model 3", dailyRate: 80.0, available: true },
    { year: 2018, model: "Nissan Altima", dailyRate: 40.0, available: true },
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: car,
    });
  }

  console.log("Seeding completed: Cars added to the database");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
