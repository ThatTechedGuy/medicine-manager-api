import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Query,
  Int,
  Field,
} from "type-graphql";
import { Vendor } from "../entity/Vendor";

@InputType()
class VendorAdd {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  address: string;
  @Field()
  phoneNumber: string;
}

@Resolver((of) => Vendor)
export class VendorResolver {
  @Mutation(() => Vendor)
  async addVendor(@Arg("options", () => VendorAdd) options: VendorAdd) {
    return await Vendor.create(options).save();
  }

  @Query(() => [Vendor])
  async vendors() {
    return await Vendor.find();
  }

  @Query(() => Vendor)
  async vendor(@Arg("id", () => Int) id: number) {
    return await Vendor.findOne({ id });
  }
}
