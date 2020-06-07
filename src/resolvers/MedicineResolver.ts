import {
  Resolver,
  Query,
  Arg,
  Int,
  Root,
  FieldResolver,
  Mutation,
} from "type-graphql";
import { Medicine } from "../entity/Medicine";
import { Vendor } from "../entity/Vendor";
import { getConnection } from "typeorm";

@Resolver((of) => Medicine)
export class MedicineResolver {
  @Mutation(() => Boolean)
  async medicineToVendor(
    @Arg("medicineId", () => Int) medicineId: number,
    @Arg("vendorId") vendorId: number
  ) {
    try {
      await getConnection()
        .createQueryBuilder()
        .relation(Vendor, "medicines")
        .of(vendorId)
        .add(medicineId);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Query(() => [Medicine])
  async medicines() {
    return await Medicine.find();
  }

  @Query(() => Medicine)
  async medicine(@Arg("id", () => Int) id: number) {
    return await Medicine.findOne(id);
  }

  @FieldResolver(() => Vendor)
  async vendor(@Root() medicine: Medicine) {
    return await getConnection()
      .createQueryBuilder()
      .relation(Medicine, "vendor")
      .of(medicine)
      .loadOne();
  }
}
