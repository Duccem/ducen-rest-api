import { Forbidden } from "../../../shared/domain/Errors/Errors";
import { Inject, Service } from "typedi";
import { AbilityMaker } from "../domain/Interfaces/AbilityMaker";
import { Profile } from "../domain/Profile";
import { ProfileJsonDocument } from "../domain/types/ProfileJsonDocument";
import { Action, Operation } from "../domain/types/Policy";

@Service("PoliciesPermissionsService")
export class PoliciesPermissionsService {
    constructor(@Inject("AbilityMaker") private abilityMaker: AbilityMaker){}

    public checkPermissions(profileInToken: ProfileJsonDocument, operation: Operation | Action, entities: string[]){
        const profile = new Profile(profileInToken)
        const abilityOfProfile = this.abilityMaker.buildAbility(profile)
        const allowed = entities.map(entity => this.abilityMaker.checkIfCan(abilityOfProfile, operation, entity)).includes(false);
        if(!allowed) return;
        throw new Forbidden(`The user profile: ${profile.name} not have suficent permissions to make ${operation} on the entities: ${entities.join(', ')}`)
    }
}