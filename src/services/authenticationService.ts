import authenticationRepository, { IAuthLoginInput } from "../repositories/authenticationRepository";
import ValidationHelper from "../utils/validationHelper";
import User from "../models/userModel";
import { CustomError } from "../utils/customError";
import { HTTP_STATUS_CODE } from "../utils/httpResponse";
import emailService from "../utils/emailConfig";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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
      throw new CustomError(errors.map((e) => e.message).join(", "), HTTP_STATUS_CODE.BAD_REQUEST);
    }
  }

  private validatePasswordResetData(password: string): void {
    const rules = [
      ValidationHelper.isRequired(password, "password"),
      ValidationHelper.minLength(password, "password", 6),
      ValidationHelper.maxLength(password, "password", 100),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new CustomError(errors.map((e) => e.message).join(", "), HTTP_STATUS_CODE.BAD_REQUEST);
    }
  }

  async authLogin(data: IAuthLoginInput): Promise<any> {
    this.validateLoginData(data);
    return await authenticationRepository.authLogin(data);
  }

  async refreshToken(token: string): Promise<any> {
    return await authenticationRepository.refreshToken(token);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save reset token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw new CustomError('Error sending reset email', HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    this.validatePasswordResetData(newPassword);

    // Hash the token for comparison
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      isDeleted: false
    });

    if (!user) {
      throw new CustomError('Invalid or expired reset token', HTTP_STATUS_CODE.BAD_REQUEST);
    }

    // Let the mongoose pre-save hook handle password hashing
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async createOrUpdateUser(
    userId: string | null,
    data: { email: string; password: string; role: string; status: string; isDeleted: boolean }
  ) {
    if (userId) {
      return await authenticationRepository.updateUser(userId, data);
    } else {
      const user = await authenticationRepository.createUser(data);
      
      // Send welcome email for new users
      try {
        await emailService.sendWelcomeEmail(data.email, data.email.split('@')[0]); // Using email username as name
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't throw error here as user creation was successful
      }
      
      return user;
    }
  }

  async getUserById(id: string) {
    return await authenticationRepository.getUserById(id);
  }

  async checkEmailExists(email: string, currentUserId?: string | null): Promise<boolean> {
    return await authenticationRepository.checkEmailExists(email, currentUserId);
  }

  async deleteUserPermanently(userId: string): Promise<void> {
    await authenticationRepository.deleteUserPermanently(userId);
  }
}

export default new AuthenticationService();