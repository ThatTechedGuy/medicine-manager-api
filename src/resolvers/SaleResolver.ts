import {
  Field,
  Resolver,
  Arg,
  InputType,
  Int,
  Mutation,
  FieldResolver,
  Root,
  Query,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Medicine } from "../entity/Medicine";
import { Sale } from "../entity/Sale";

@InputType()
class SalesOptions {
  @Field(() => Int)
  medicineId: number;
  @Field(() => Int)
  quantitySold: number;
}

@Resolver((of) => Sale)
export class SaleResolver {
  @Mutation(() => Sale)
  async sellMedicine(
    @Arg("options", () => SalesOptions) options: SalesOptions
  ) {
    const medicine = await Medicine.findOne(options.medicineId);
    if (!medicine) throw Error("No medicines found with the associated id");

    const newQuantity = medicine.quantity - options.quantitySold;
    if (newQuantity < 0) throw Error("Invalid quantity specified.");

    Medicine.merge(medicine, {
      quantity: newQuantity,
    });

    const result = await medicine.save();

    const date = new Date();
    const sale = await Sale.create({
      quantitySold: options.quantitySold,
      dateSold: date,
    }).save();

    await getConnection()
      .createQueryBuilder()
      .relation(Medicine, "sales")
      .of(result.id)
      .add(sale.id);

    return sale;
  }

  @Query(() => Sale)
  async sale(@Arg("id", () => Int) id: number) {
    return await Sale.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteAllSales() {
    try {
      await Sale.clear();
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteSale(@Arg("saleId", () => Int) id: number) {
    try {
      await Sale.delete(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Query(() => [Sale])
  async sales() {
    return await Sale.find();
  }

  @FieldResolver(() => Sale)
  async medicine(@Root() sale: Sale) {
    return await getConnection()
      .createQueryBuilder()
      .relation(Sale, "medicine")
      .of(sale)
      .loadOne();
  }
}
