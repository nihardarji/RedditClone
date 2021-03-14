import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Field, ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()  // For Graphql
@Entity()
export class Post extends BaseEntity {

    // Field can be used to expose the field to graphql
    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string

    @Field()
    @Column()
    text!: string

    @Field()
    @Column({ type: 'int', default: 0 })
    points!: number

    @Field()
    @Column()
    creatorId: number

    @Field()
    @ManyToOne(() => User, (user) => user.posts)
    creator: User

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date
}