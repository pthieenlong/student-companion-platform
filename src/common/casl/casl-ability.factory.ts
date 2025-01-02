import { Injectable } from "@nestjs/common";
import {
  Ability, AbilityBuilder, AbilityClass, InferSubjects, ExtractSubjectType
} from '@casl/ability';
import { EAbility, GroupRole, Role } from "../../shared/enum/EUser";
import User from "../../modules/user/entities/user.entity";
import { defineFollowerAbility, defineUserAbility } from "./account.ability";
import { defineReaderAbility, defineWriterAbility } from "./note.ability";
export type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[EAbility, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Partial<User>) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[EAbility, Subjects]>>(Ability as AbilityClass<AppAbility>);

    switch(user.role) {
      case Role.ADMIN: {
        break;
      }
      case Role.USER: {
        // defineUserAbility(can, cannot);
        // defineFollowerAbility(can, cannot);
        // defineReaderAbility(can, cannot);
        // defineWriterAbility(can, cannot);
        break;
      }
      default: {
        break;
      }
    }
  }
}
