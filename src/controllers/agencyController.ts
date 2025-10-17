import { Request, Response, NextFunction } from "express";
import agencyService from "../services/agencyService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { ILeanAgency } from "../models/agencyModel";
import authenticationService from "../services/authenticationService";
import { RoleModel } from "../models/roleModel";

class AgencyController {
  async createAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Check if emails already exist before creating user
      if (data.yourEmail) {
        const emailExists = await authenticationService.checkEmailExists(data.yourEmail);
        if (emailExists) {
          res.status(400).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Personal email already exists",
            code: 11000,
            keyPattern: { yourEmail: 1 }
          });
          return;
        }
      }

      if (data.companyEmail) {
        const companyEmailExists = await agencyService.checkCompanyEmailExists(data.companyEmail);
        if (companyEmailExists) {
          res.status(400).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Company email already exists",
            code: 11000,
            keyPattern: { companyEmail: 1 }
          });
          return;
        }
      }

      // Save or update user
      // Get the agency role ID
      const agencyRole = await RoleModel.findOne({ slug: 'agency' });
      if (!agencyRole) {
        res.status(500).json({ status: HTTP_RESPONSE.FAIL, message: "Agency role not found" });
        return;
      }
      
      console.log('Found agency role:', agencyRole);
      console.log('Role ID:', agencyRole._id.toString());
      console.log('Input data:', {
        email: data.yourEmail,
        name: data.name,
        agencyName: data.agencyName
      });

      // Ensure we have all required fields
      if (!data.yourEmail || !data.password) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Email and password are required"
        });
        return;
      }

      const name = data.name || data.agencyName || data.yourEmail.split('@')[0];
      if (!name) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name is required"
        });
        return;
      }

      const userPayload = {
        email: data.yourEmail,
        password: data.password,
        name: name,
        roleId: agencyRole._id.toString(), // Convert ObjectId to string
        status: "active",
        isDeleted: false,
      };
      
      console.log('User payload:', userPayload);

      const userId = data.userId || null;
      const user = await authenticationService.createOrUpdateUser(userId, userPayload);

      if (!user || !user._id) {
        console.error('User creation/update failed or userId missing:', user);
        res.status(400).json({ status: false, message: "User not found. Contact admin." });
        return;
      }

      // Remove email and password from agency data
      delete data.yourEmail;
      delete data.password;

      // Add userId to agency data
      data.userId = user._id;
      console.log('Assigned userId to agency:', data.userId);

      // Handle files
      data.agencyLogo = files?.agencyLogo?.[0]?.path.replace(/\\/g, '/') || '';
      data.photo = files?.photo?.[0]?.path.replace(/\\/g, '/') || '';
      data.uploadIdProof = files?.uploadIdProof?.[0]?.path.replace(/\\/g, '/') || '';
      data.uploadBusinessProof = files?.uploadBusinessProof?.[0]?.path.replace(/\\/g, '/') || '';

      const agency = await agencyService.createAgency(data);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency created", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllAgencies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await agencyService.getAllAgencies(page, limit);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getAgencyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const agency = await agencyService.getAgencyById(id);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async updateAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }

      const data = { ...req.body };
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Get current agency data for comparison
      const currentAgency = await agencyService.getAgencyById(id);
      if (!currentAgency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }

      // Check if personal email is being changed and if new email already exists
      if (data.yourEmail && data.yourEmail !== currentAgency.yourEmail) {
        const emailExists = await authenticationService.checkEmailExists(
          data.yourEmail,
          currentAgency.userId?.toString()
        );
        if (emailExists) {
          res.status(400).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Personal email already exists"
          });
          return;
        }
      }

      // Check if company email is being changed and if new email already exists
      if (data.companyEmail && data.companyEmail !== currentAgency.companyEmail) {
        const companyEmailExists = await agencyService.checkCompanyEmailExists(
          data.companyEmail,
          id
        );
        if (companyEmailExists) {
          res.status(400).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Company email already exists"
          });
          return;
        }
      }

      // Update user information in user collection if it changed
      if (data.userId && (data.yourEmail || data.companyName)) {
        // Get the agency role ID since we need it for the update
        const agencyRole = await RoleModel.findOne({ slug: 'agency' });
        if (!agencyRole) {
          res.status(500).json({ status: HTTP_RESPONSE.FAIL, message: "Agency role not found" });
          return;
        }

        const userPayload = {
          email: data.yourEmail,
          name: data.companyName || data.yourEmail.split('@')[0],
          roleId: agencyRole._id.toString(),
          status: "active",
          isDeleted: false,
        } as any;
        
        // If password is provided in update, include it
        if (data.password) {
          userPayload.password = data.password;
        }

        await authenticationService.createOrUpdateUser(data.userId, userPayload);
        delete data.yourEmail;
        delete data.password;
      }

      // Safely handle file paths
      if (files?.agencyLogo?.[0]?.path) {
        data.agencyLogo = files.agencyLogo[0].path.replace(/\\/g, '/');
      }
      if (files?.photo?.[0]?.path) {
        data.photo = files.photo[0].path.replace(/\\/g, '/');
      }
      if (files?.uploadIdProof?.[0]?.path) {
        data.uploadIdProof = files.uploadIdProof[0].path.replace(/\\/g, '/');
      }
      if (files?.uploadBusinessProof?.[0]?.path) {
        data.uploadBusinessProof = files.uploadBusinessProof[0].path.replace(/\\/g, '/');
      }

      // Don't update file fields if they were not provided in the request
      if (!files?.agencyLogo) delete data.agencyLogo;
      if (!files?.photo) delete data.photo;
      if (!files?.uploadIdProof) delete data.uploadIdProof;
      if (!files?.uploadBusinessProof) delete data.uploadBusinessProof;

      const agency = await agencyService.updateAgency(id, data);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency updated", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const agency = await agencyService.deleteAgency(id);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency deleted", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreAgency(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const agency = await agencyService.restoreAgency(id);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency restored successfully", data: agency });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashAgencies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await agencyService.getAllTrashAgencies(page, limit);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleAgencyStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const updated = await agencyService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency status toggled", data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteAgencyPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Agency id is required" });
        return;
      }
      const agency = await agencyService.deleteAgencyPermanently(id);
      if (!agency) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Agency not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Agency permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }

  async checkEmailsExist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { yourEmail, companyEmail, currentId } = req.body;
      
      if (!yourEmail || !companyEmail) {
        res.status(400).json({ 
          status: HTTP_RESPONSE.FAIL, 
          message: "Both personal email and company email are required" 
        });
        return;
      }

      let currentAgency: ILeanAgency | null = null;
      let currentUserId: string | null = null;
      
      if (currentId) {
        currentAgency = await agencyService.getAgencyById(currentId);
        console.log('Current agency:', currentAgency);
        
        if (currentAgency?.userId) {
          const currentUser = await authenticationService.getUserById(currentAgency.userId);
          console.log('Found user:', currentUser);
          
          // if (currentUser && currentUser._id) {
          //   currentUserId = currentUser._id;
          //   console.log('Current user ID for email check:', currentUserId);
          // }
        }
      }

      const [yourEmailExists, companyEmailExists] = await Promise.all([
        authenticationService.checkEmailExists(yourEmail, currentUserId),
        agencyService.checkCompanyEmailExists(companyEmail, currentId)
      ]);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: { yourEmailExists, companyEmailExists }
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AgencyController();