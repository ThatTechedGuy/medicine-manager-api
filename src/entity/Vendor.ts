import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { Medicine } from "./Medicine";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity()
export class Vendor extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => [Medicine])
  @OneToMany(() => Medicine, (medicine) => medicine.vendor, { eager: true })
  medicines: Medicine[];
}
