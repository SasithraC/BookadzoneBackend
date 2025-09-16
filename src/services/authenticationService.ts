// services/authenticationService.ts
import authenticationRepository, { IAuthLoginInput } from "../repositories/authenticationRepository";
import ValidationHelper, { ValidationError } from "../utils/validationHelper";


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

  async authLogin(data: IAuthLoginInput): Promise<any> {
    this.validateLoginData(data);
    return await authenticationRepository.authLogin(data);
  }

  async refreshToken(token: string): Promise<any> {
    // Validate and decode token
    return await authenticationRepository.refreshToken(token);
  }
}

export default new AuthenticationService();