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
import { Order } from "../entity/Order";

@InputType()
class OrderOptions {
  @Field(() => Int)
  medicineId: number;
  @Field(() => Int)
  quantityOrdered: number;
}

@Resolver((of) => Order)
export class OrderResolver {
  @Mutation(() => Order)
  async orderMedicine(
    @Arg("options", () => OrderOptions) options: OrderOptions
  ) {
    const medicine = await Medicine.findOne(options.medicineId);
    if (!medicine) throw Error("No medicines found with the associated id");

    const newQuantity = medicine.quantity + options.quantityOrdered;
    if (options.quantityOrdered == 0)
      throw Error("The quantity for ordering cannot be 0.");

    Medicine.merge(medicine, {
      quantity: newQuantity
    });

    const result = await medicine.save();

    const dateOrdered = new Date();

    const order = await Order.create({
      dateOrdered,
      quantityOrdered: newQuantity,
    }).save();

    await getConnection()
      .createQueryBuilder()
      .relation(Medicine, "orders")
      .of(result.id)
      .add(order);

    return order;
  }

  @Query(() => Order)
  async Order(@Arg("id", () => Int) id: number) {
    return await Order.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteAllOrders() {
    try {
      await Order.clear();
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Arg("OrderId", () => Int) id: number) {
    try {
      await Order.delete(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Query(() => [Order])
  async orders() {
    return await Order.find();
  }

  @FieldResolver(() => Order)
  async medicine(@Root() order: Order) {
    return await getConnection()
      .createQueryBuilder()
      .relation(Order, "medicine")
      .of(order)
      .loadOne();
  }
}
