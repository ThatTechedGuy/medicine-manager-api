import {
  Resolver,
  Query,
  Arg,
  Int,
  Root,
  FieldResolver,
  Mutation,
  InputType,
  Field,
} from "type-graphql";
import { Medicine } from "../entity/Medicine";
import { Vendor } from "../entity/Vendor";
import { getConnection } from "typeorm";

@InputType()
class DateType {
  @Field(() => Int)
  day: number;
  @Field(() => Int)
  month: number;
  @Field(() => Int)
  year: number;
}

@InputType()
class MedicineAdd {
  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Int)
  minimumQuantity: number;

  @Field(() => Int)
  price: number;

  @Field()
  description: string;

  @Field(() => DateType)
  expiryDate: DateType;
}

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

  @Mutation(() => Medicine)
  async addMedicine(
    @Arg("options", () => MedicineAdd) options: MedicineAdd,
    @Arg("vendorId", () => Int, { nullable: true }) vendorId?: number
  ) {
    const { expiryDate, ...other } = options;
    const { year, month, day } = expiryDate;

    const medicine = await Medicine.create({
      ...other,
      expiryDate: new Date(`${year}-${month}-${day}`),
    }).save();

    if (vendorId) {
      await getConnection()
        .createQueryBuilder()
        .relation(Vendor, "medicines")
        .of(vendorId)
        .add(medicine);

      return medicine;
    }

    return medicine;
  }

  @Query(() => [Medicine])
  async medicines() {
    return await Medicine.find();
  }

  @Query(() => [Medicine])
  async expired() {
    return await Medicine.find({hasExpired: true});
  }

  @Query(() => [Medicine])
  async isShort() {
    return await Medicine.find({ isShort: true });
  }

  @Query(() => Medicine)
  async medicine(@Arg("id", () => Int) id: number) {
    return await Medicine.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteMedicine(@Arg("id", () => Int) id: number) {
    try {
      await Medicine.delete(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteAllMedicines() {
    try {
      await Medicine.clear();
      return true;
    } catch (e) {
      return false;
    }
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
