import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Vendor } from "./Vendor";

@ObjectType()
@Entity()
export class Medicine extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  quantity: number;

  // @Column()
  // minimumQuantity: number;

  // @Column()
  // avgSalePerWeek: number;

  @Field()
  @Column()
  price: number;

  // @Column()
  // description: string;

  // @Column("date", { nullable: true })
  // lastSold?: Date;

  // @Column("date")
  // expiryDate: Date;

  @Field()
  @Column({ nullable: true })
  hasExpired: boolean;

  @Field(() => Vendor)
  @ManyToOne(() => Vendor, (vendor) => vendor.medicines)
  vendor: Vendor;
}
