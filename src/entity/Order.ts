import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Medicine } from "./Medicine";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  quantityOrdered: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateOrdered: Date;

  @Field(() => Medicine, { nullable: true })
  @ManyToOne((type) => Medicine, (medicine) => medicine.orders, {
    nullable: true,
  })
  medicine: Medicine;
}
