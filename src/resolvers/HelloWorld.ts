import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloWorldResolver{
    @Query(() => String)
    hello(){
        return "GraphQL Server running";
    }
}