import { Vendor } from "./entity/Vendor";
import { Medicine } from "./entity/Medicine";
import { getConnection } from "typeorm";

var medicines = [
  {
    name: "Med1",
    quantity: 1,
    price: 150,
    hasExpired: true,
    vendorId: 1,
  },
  {
    name: "Med2",
    quantity: 5,
    price: 15055,
    hasExpired: false,
    vendorId: 2,
  },
];

var vendors = [
  {
    name: "Vendor1",
    email: "email1@email.com",
  },
  {
    name: "Vendor2",
    email: "email2@email2.com",
  },
];

export const seedDb = async () => {
  //Add vendors
  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Vendor)
    .values(vendors)
    .execute();

  // Add medicines
  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Medicine)
    .values(medicines)
    .execute();

  // Conecting Medicine to Vendor
  await getConnection()
    .createQueryBuilder()
    .relation(Vendor, "medicines")
    .of(1)
    .add(1);

  await getConnection()
    .createQueryBuilder()
    .relation(Vendor, "medicines")
    .of(2)
    .add(2);

  console.log(await Vendor.find());
};
