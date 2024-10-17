import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { comparePasswords, encodePassword } from 'src/utils/bcrypt';
import { CreateUserDTO } from './dtos/createuser.dto';
// import { HistoryService } from 'src/history/history.service';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NextOfKin } from 'src/schemas/nextofkin.schema';
import { AddNextofKinDTO } from './dtos/addnextofkin.dto';
import { Notification } from 'src/schemas/notification.schema';
import { Appointment } from 'src/schemas/appointments.schema';
import { AddAppointmentDTO } from './dtos/addappointment.dto';
import { ChangePasswordDTO } from './dtos/changepassword.dto';
import { AccountDeletionDTO } from './dtos/accountdeletion.dto';
import { Requests } from 'src/schemas/requests.schema';
// import { SocketGateway } from 'src/socket/socket.gateway';
// import { paginate, PaginateConfig } from 'nestjs-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userRepository: Model<User>,
    @InjectModel(NextOfKin.name) private nextofKinRepository: Model<NextOfKin>,
    @InjectModel(Appointment.name)
    private appointmentRepository: Model<Appointment>,
    @InjectModel(Notification.name)
    private notificationRepository: Model<Notification>,
    @InjectModel(Requests.name)
    private requestsRepository: Model<Requests>,
  ) {}

  async findAllNotifications() {
    return this.notificationRepository.find({});
  }

  async findUsers(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.userRepository
        .find({})
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .exec(),
      this.userRepository.countDocuments(), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }

  async createUser(createUserDto: CreateUserDTO): Promise<User> {
    const encodedPassword = await encodePassword(createUserDto.password);
    const newUser = new this.userRepository({
      password: encodedPassword,
      email_address: createUserDto?.email_address,
      first_name: createUserDto?.first_name,
      last_name: createUserDto.last_name,
      phone_number: createUserDto?.phone_number,
      international_phone_format: createUserDto?.international_phone_format,
      is_profile_set: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await new this.notificationRepository({
      category: 'welcome',
      title: `Welcome to QuickPocket`,
      user: newUser?.id ?? newUser?._id,
    }).save();

    return newUser.save();
  }

  async findUserByUsername(email_address: string): Promise<User> {
    const foundUser = await this.userRepository
      .findOne({
        email_address: email_address,
      })
      .lean()
      .exec();

    return foundUser;
  }

  findUserById(id: any): Promise<User> {
    return this.userRepository.findById(id);
  }

  async updateUser(email_address: string, payload: any) {
    // console.log('PAYLOAD PROFILE UPDATE ::: ', payload);

    try {
      if (!payload) {
        throw new HttpException(
          'Payload not provided!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userRepository.findOne({
        email_address: email_address,
      });

      if (!user)
        throw new HttpException('No user found.', HttpStatus.NOT_FOUND);

      await this.userRepository.updateOne(
        { email_address: email_address },
        { ...payload },
      );
      const updatedUser = await this.userRepository
        .findOne({
          email_address: email_address,
        })
        .lean()
        .exec();

      await new this.notificationRepository({
        status: 'success',
        title: `You updated your profile on ${new Date().toLocaleString('en-GB')}`,
        type: 'profile',
        email_address: user?.email_address,
      }).save();

      const { password, ...data } = updatedUser;
      console.log('REMOVED PASWORD ::: ', password);

      global.io?.emit('profile-updated', {
        message: 'You updated your profile',
        user: data,
      });

      return {
        message: 'Profile updated successfully',
        user: data,
      };
    } catch (error) {
      console.log('PROFILE UPDATE ERROR ::: ', error);
      return {
        message: error?.response?.data?.message || 'An error occurred!',
      };
    }
  }

  async addNextofKin(payload: AddNextofKinDTO, userId: string): Promise<any> {
    // First check if it has been added before
    // If so  then update it.

    const foundNOK = await this.nextofKinRepository
      .findOne({ user: userId })
      .lean()
      .exec();

    if (foundNOK) {
      await this.nextofKinRepository.updateOne(
        { user: userId },
        { ...payload },
      );
      const result = await this.nextofKinRepository
        .findOne({
          _id: foundNOK._id,
        })
        .lean()
        .exec();
      return {
        message: 'Next of Kin updated successfully',
        data: result,
      };
    } else {
      const newNextofKin = await new this.nextofKinRepository({
        email_address: payload?.email_address,
        first_name: payload?.first_name,
        last_name: payload.last_name,
        phone_number: payload?.phone_number,
        address: payload?.phone_number,
        relationship: payload?.relationship,
        user: userId,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();

      await new this.notificationRepository({
        category: 'next-of-kin',
        title: `You added next of kin`,
        user: userId,
      }).save();

      return {
        message: 'Next of Kin added successfully',
        data: newNextofKin,
      };
    }
  }

  async getNextofKin(userId: string) {
    const foundNOK = await this.nextofKinRepository
      .findOne({ user: userId })
      .lean()
      .exec();

    return {
      message: 'Next of Kin fetched successfully',
      data: foundNOK,
    };
  }

  async bookAppointment(
    payload: AddAppointmentDTO,
    userId: string,
  ): Promise<any> {
    const newAppointment = await new this.appointmentRepository({
      amount: payload?.amount,
      asset: payload?.asset,
      asset_proof:
        payload.category !== 'working-class' ? payload?.upload_url : null,
      bank_statement:
        payload?.category === 'working-class' ? payload?.upload_url : null,
      category: payload?.category,
      reason: payload?.reason,
      employer_name:
        payload?.category === 'working-class' ? payload?.employer_name : null,
      location: payload?.location,
      work_address:
        payload?.category === 'working-class' ? payload?.work_address : null,
      status: 'pending',
      user: userId,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    await new this.notificationRepository({
      category: 'appointment',
      title: `You requested to book ${payload?.category} appointment`,
      user: userId,
    }).save();

    return {
      message: 'Appointment booked. Awaiting approval',
      data: newAppointment,
    };
  }

  async changePassword(
    { current_password, new_password }: ChangePasswordDTO,
    email_address: string,
  ): Promise<any> {
    // First check if user exists
    const user = await this.userRepository.findOne({ email_address });
    if (!user) {
      throw new HttpException('No user record found.', HttpStatus.NOT_FOUND);
    }
    // Now check if the current password is correct
    const compare = comparePasswords(current_password, user?.password);
    if (!compare) {
      // Wrong current password
      throw new HttpException(
        'Current password is wrong.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const encodedPassword = await encodePassword(new_password);
    await this.userRepository.updateOne(
      { email_address },
      {
        password: encodedPassword,
      },
    );

    await new this.notificationRepository({
      category: 'password-change',
      title: `You updated your account password`,
      user: user?._id,
    }).save();

    return {
      message: 'Password changed successfully',
      action: 'logout',
      data: null,
    };
  }

  async requestAccountDeletion(
    { reason }: AccountDeletionDTO,
    userId: string,
  ): Promise<Requests> {
    try {
      const newRequest = new this.requestsRepository({
        reason,
        requests_type: 'account_deletion',
        status: 'pending',
        user: userId,
        created_at: new Date(),
        updated_at: new Date(),
      });

      return newRequest.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findNotifications(page: number, limit: number, email_address: string) {
    // Get user data first
    const userObj = await this.userRepository
      .findOne({ email_address: email_address })
      .lean()
      .exec();

    if (!userObj) {
      throw new HttpException('User record not found', HttpStatus.NOT_FOUND);
    }
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.notificationRepository
        .find({
          user: userObj?._id,
        })
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .exec(),
      this.notificationRepository.countDocuments({ user: userObj?._id }), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }
}
