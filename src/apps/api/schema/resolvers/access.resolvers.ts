
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { User, UserInput } from '../types/user.type';
import { UserAccessService } from '../../../../contexts/ClientAttention/Users/application/UserAccessService';
import { Inject } from 'typedi';
@Resolver(of => User)
export class AccessResolver{
    constructor(@Inject("UserAccessService") private readonly userAccessService: UserAccessService){}
    
    @Query(returns => User)
    async login(@Arg('username') username: string, @Arg('password') password: string): Promise<any>{
        const response = await this.userAccessService.login(username, password);
        return response;
    }

    @Query(returns => String)
    async chooseProfile(): Promise<string | undefined>{
        return this.userAccessService.log();
    }

    @Mutation(returns => User)
    async signin(@Arg('user') user: UserInput): Promise<any>{
        const response = this.userAccessService.signup(user as any);
        console.log(response)
        return response;
    }
}