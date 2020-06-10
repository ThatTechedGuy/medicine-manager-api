import {
  Entity,
  BaseEntity,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  AfterUpdate,
  AfterLoad,
  AfterInsert,
  getConnection,
  ManyToOne,
} from "typeorm";
import { Medicine } from "./Medicine";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Sale extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  quantitySold: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dateSold: Date;

  @Field(() => Medicine, { nullable: true })
  @ManyToOne((type) => Medicine, (medicine) => medicine.sales, {
    nullable: true,
  })
  medicine: Medicine;
}
