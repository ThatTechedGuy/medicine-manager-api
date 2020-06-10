import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  JoinTable,
  AfterLoad,
  AfterUpdate,
  AfterInsert,
  PrimaryColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Vendor } from "./Vendor";
import { Sale } from "./Sale";
import { Order } from "./Order";

@ObjectType()
@Entity()
export class Medicine extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => Int)
  @Column()
  quantity: number;

  @Field(() => Int)
  @Column()
  minimumQuantity: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  avgSalePerWeek: number = 0;

  @Field(() => Int)
  @Column()
  price: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  expiryDate: Date;

  @Field({ nullable: true })
  @Column({ type: Boolean, nullable: true })
  hasExpired: boolean;

  @Field({ nullable: true })
  @Column({ type: Boolean, nullable: true })
  isShort: boolean;

  @Field(() => Vendor, { nullable: true })
  @ManyToOne(() => Vendor, (vendor) => vendor.medicines, { nullable: true })
  vendor?: Vendor;

  @Field(() => [Sale], { nullable: true })
  @OneToMany(() => Sale, (sale) => sale.medicine, {
    eager: true,
    nullable: true,
  })
  sales: Sale[];

  @Field(() => [Order], { nullable: true })
  @OneToMany(() => Order, (order) => order.medicine, {
    eager: true,
    nullable: true,
  })
  orders: Order[];

  @AfterUpdate()
  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  @AfterInsert()
  async job() {
    if (new Date().getTime() > this.expiryDate.getTime())
      this.hasExpired = true;
    else this.hasExpired = false;

    if (this.quantity < this.minimumQuantity) this.isShort = true;
    else this.isShort = false;

    if (this.quantity < 0) this.quantity = 0;
  }
}
