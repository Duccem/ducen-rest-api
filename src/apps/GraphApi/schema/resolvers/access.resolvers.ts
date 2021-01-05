
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '../types/user.type';
import { UserCommands } from '../../../../contexts/ClientAttention/Users/application/UserCommands';
;
import { tokenKey } from '../../config/keys';
import { Service } from 'typedi';
import { MongoDBRepoitory } from '../../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository';
import { InMemoryAsyncEventBus } from 'contexts/shared/infraestructure/EventBus/InMemoryAsyncEventBus/InMemoryAsyncEventBus';

@Service()
@Resolver(of => User)
export class AccessResolver{
    constructor(private readonly userCommands: UserCommands){}
    
    @Query(returns => User)
    async login(@Arg('username') username: string, @Arg('password') password: string): Promise<any>{
        const response = await this.userCommands.login(username, password);
        return response;
    }

    @Query(returns => String)
    async chooseProfile(): Promise<string | undefined>{
        return '23rsfshdksdlkfhslkdhf';
    }

    @Mutation(returns => User)
    async signin(): Promise<any>{
        return {
            _id: '145asdfsh1345tsdghfdgf',
            username: 'ducen',
            email: 'ducen29@gmail.com'
        };
    }
}