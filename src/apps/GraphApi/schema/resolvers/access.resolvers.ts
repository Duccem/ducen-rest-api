
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { User, UserInput } from '../types/user.type';
import { UserCommands } from '../../../../contexts/ClientAttention/Users/application/UserCommands';
import { Inject } from 'typedi';
@Resolver(of => User)
export class AccessResolver{
    constructor(@Inject("UserService") private readonly userCommands: UserCommands){}
    
    @Query(returns => User)
    async login(@Arg('username') username: string, @Arg('password') password: string): Promise<any>{
        const response = await this.userCommands.login(username, password);
        return response;
    }

    @Query(returns => String)
    async chooseProfile(): Promise<string | undefined>{
        return this.userCommands.log();
    }

    @Mutation(returns => User)
    async signin(@Arg('user') user: UserInput): Promise<any>{
        const response = this.userCommands.signup(user as any);
        console.log(response)
        return response;
    }
}