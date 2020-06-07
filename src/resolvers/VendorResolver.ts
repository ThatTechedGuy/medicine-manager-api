import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Query,
  Int,
  Field,
  FieldResolver,
  Root,
} from "type-graphql";
import { Vendor } from "../entity/Vendor";
import { Medicine } from "../entity/Medicine";
import { getConnection } from "typeorm";

@InputType()
class VendorAdd {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
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
