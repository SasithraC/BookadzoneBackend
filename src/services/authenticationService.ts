// services/authenticationService.ts
import authenticationRepository, { IAuthLoginInput } from "../repositories/authenticationRepository";
import ValidationHelper from "../utils/validationHelper";
import type { StringValue } from "ms";

interface IMenuItem {
  name: string;
  slug: string;
  icon: string;
  path?: string;
  sequenceOrder: number;
  children?: ISubmenuItem[];
  special?: boolean;
}

interface ISubmenuItem {
  name: string;
  slug: string;
  path: string;
}

interface IUser {
  _id: string;
  email: string;
  role: string;
  status: string;
}

class AuthenticationService {
  private validateLoginData(data: IAuthLoginInput): void {
    const rules = [
      ValidationHelper.isRequired(data.email, "email"),
      ValidationHelper.isValidEmail(data.email, "email"),
      ValidationHelper.isRequired(data.password, "password"),
      ValidationHelper.minLength(data.password, "password", 6),
      ValidationHelper.maxLength(data.password, "password", 100),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
  }

  async authLogin(data: IAuthLoginInput): Promise<{
    token: string;
    data: Partial<IUser>;
    expiresIn: StringValue;
    menus: IMenuItem[];
  }> {
    this.validateLoginData(data);
    return await authenticationRepository.authLogin(data);
  }

  async refreshToken(token: string): Promise<{
    token: string;
    data: Partial<IUser>;
    expiresIn: StringValue;
    menus: IMenuItem[];
  }> {
    return await authenticationRepository.refreshToken(token);
  }
}

export default new AuthenticationService();