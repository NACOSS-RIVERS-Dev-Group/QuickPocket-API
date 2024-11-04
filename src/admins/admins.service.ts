import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { User } from 'src/schemas/user.schema';
import { CreateAdminDTO } from './dtos/createadmin.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { Activities } from 'src/schemas/activities.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminRepository: Model<Admin>,
    @InjectModel(Activities.name)
    private activitiesRepository: Model<Activities>,
  ) {}

  async findAdmins(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.adminRepository
        .find({})
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .exec(),
      this.adminRepository.countDocuments(), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }

  async createAdmin(createAdmin: CreateAdminDTO): Promise<any> {

    // Check if email or password is used
    const exists = await this.adminRepository.findOne({
      email_address: createAdmin.email_address,
    });

    if (exists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Email address already in use',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const phoneExists = await this.adminRepository.findOne({
      phone_number: createAdmin.phone_number,
    });

    if (phoneExists) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Phone number already in use',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const encodedPassword = await encodePassword(createAdmin.password);
    const newAdmin = await new this.adminRepository({
      password: encodedPassword,
      email_address: createAdmin?.email_address,
      first_name: createAdmin?.first_name,
      last_name: createAdmin.last_name,
      phone_number: createAdmin?.phone_number,
      role: createAdmin?.role,
      access: createAdmin?.access,
      is_email_verified: false,
      is_profile_set: false,
      type: createAdmin?.type,
      photo: '',
      address: createAdmin.address,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    await new this.activitiesRepository({
      category: 'welcome',
      title: `Welcome to QuickPocket`,
      user: newAdmin?.id ?? newAdmin?._id,
    }).save();

    return {
      message: 'Operation successful',
      data: newAdmin,
    };
  }

  async findAdminByUsername(email_address: string): Promise<any> {
    const foundAdmin = await this.adminRepository
      .findOne({
        email_address: email_address
      })
      .lean()
      .exec();

    return foundAdmin;
  }

  findAdminById(id: any): Promise<Admin> {
    return this.adminRepository.findById(id);
  }

  async updateAdmin(email_address: string, payload: any) {
    // console.log('PAYLOAD PROFILE UPDATE ::: ', payload);

    if (!payload) {
      throw new HttpException('Payload not provided!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.adminRepository.findOne({
      email_address: email_address,
    });

    if (!user) throw new HttpException('No record found.', HttpStatus.NOT_FOUND);

    await this.adminRepository.updateOne(
      { email_address: email_address },
      { ...payload },
    );
    const updatedAdmin = await this.adminRepository
      .findOne({
        email_address: email_address,
      })
      .lean()
      .exec();

    await new this.activitiesRepository({
      status: 'success',
      title: `You updated ${updatedAdmin?.first_name} ${updatedAdmin?.last_name}'s profile on ${new Date().toLocaleString('en-GB')}`,
      type: 'profile',
      email_address: user?.email_address,
    }).save();

    const { password, ...data } = updatedAdmin;
    console.log('REMOVED PASWORD ::: ', password);

    global.io?.emit('profile-updated', {
      message: 'You updated your profile',
      user: data,
    });

    return {
      message: 'Profile updated successfully',
      user: data,
    };
  }


}
