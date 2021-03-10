import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()  // For Graphql
@Entity()
export class Post extends BaseEntity {

    // Field can be used to expose the field to graphql
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @Column()
    title!: string;

}