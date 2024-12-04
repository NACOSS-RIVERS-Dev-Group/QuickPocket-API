/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import {
  AccessRights,
  AdminRoles,
  CreateAdminDTO,
} from './dtos/createadmin.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { Activities } from 'src/schemas/activities.schema';
import { Appointment } from 'src/schemas/appointments.schema';
import { AddSocialDTO } from './dtos/addsocial.dto';
import { Social } from 'src/schemas/socials.schema';
import { AddBannerDTO } from './dtos/addbanner.dto';
import { Banner } from 'src/schemas/banner.schema';
import { Settings } from 'src/schemas/settings.schema';
import { Location } from 'src/schemas/location.schema';
import { Reason } from 'src/schemas/reasons.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminRepository: Model<Admin>,
    @InjectModel(Activities.name)
    private activitiesRepository: Model<Activities>,
    @InjectModel(Appointment.name)
    private appointmentRepository: Model<Appointment>,
    @InjectModel(Social.name)
    private socialRepository: Model<Social>,
    @InjectModel(Banner.name)
    private bannerRepository: Model<Banner>,
    @InjectModel(Settings.name)
    private settingsRepository: Model<Settings>,
    @InjectModel(Location.name)
    private locationsRepository: Model<Location>,
    @InjectModel(Reason.name)
    private reasonsRepository: Model<Reason>,
  ) {}

  async findAdmins(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.adminRepository
        .find({})
        .populate('location')
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
      location: createAdmin?.location,
      is_email_verified: false,
      is_profile_set: false,
      type: createAdmin?.type,
      photo: '',
      address: createAdmin.address ?? 'lagos',
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    await new this.activitiesRepository({
      category: 'welcome',
      title: `Welcome to QuickPocket`,
      admin: newAdmin?.id ?? newAdmin?._id,
    }).save();

    return {
      message: 'Operation successful',
      data: newAdmin,
    };
  }

  async findAdminByUsername(email_address: string): Promise<any> {
    const foundAdmin = await this.adminRepository
      .findOne({
        email_address: email_address,
      })
      .lean()
      .exec();

    return foundAdmin;
  }

  findAdminById(id: any): Promise<Admin> {
    return this.adminRepository.findById(id).lean().exec();
  }

  async updateAdmin(email_address: string, id: string, payload: any) {
    // console.log('PAYLOAD PROFILE UPDATE ::: ', payload);

    if (!payload) {
      throw new HttpException('Payload not provided!', HttpStatus.BAD_REQUEST);
    }

    const user = await this.adminRepository.findOne({
      email_address: email_address,
    });

    if (!user)
      throw new HttpException('No record found.', HttpStatus.NOT_FOUND);

    await this.adminRepository.updateOne({ _id: id }, { ...payload });
    const updatedAdmin = await this.adminRepository
      .findOne({
        _id: id,
      })
      .lean()
      .exec();

    await new this.activitiesRepository({
      category: 'profile',
      title: `You updated ${updatedAdmin?.first_name} ${updatedAdmin?.last_name}'s profile on ${new Date().toLocaleString('en-GB')}`,
      admin: user?.id ?? user?._id,
    }).save();

    const { password, ...data } = updatedAdmin;
    console.log('REMOVED PASWORD ::: ', password);

    return {
      message: 'Admin profile updated successfully',
      user: data,
    };
  }

  async suspendAdmin(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.type !== 'superadmin' &&
        adm.role !== 'manager' &&
        adm.role !== 'developer' &&
        adm.access !== 'read/write'
      ) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'You do not hava necessary privileges for this action',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const foundAdmin = await this.adminRepository.findOne({
        _id: id,
      });
      if (!foundAdmin) {
        throw new HttpException(
          'Admin record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.adminRepository
        .updateOne(
          { _id: foundAdmin?.id ?? foundAdmin?._id ?? id },
          { $set: { status: 'suspended' } },
        )
        .lean()
        .exec();

      await new this.activitiesRepository({
        category: 'admin',
        title: `${adm?.first_name} ${adm?.last_name} suspended the admin account (${foundAdmin?.first_name} ${foundAdmin?.last_name}) on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Admin account suspended successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async pardonAdmin(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.type !== 'superadmin' &&
        adm.role !== 'manager' &&
        adm.role !== 'developer' &&
        adm.access !== 'read/write'
      ) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'You do not hava necessary privileges for this action',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const foundAdmin = await this.adminRepository.findOne({
        _id: id,
      });
      if (!foundAdmin) {
        throw new HttpException(
          'Admin record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.adminRepository
        .updateOne(
          { _id: foundAdmin?.id ?? foundAdmin?._id ?? id },
          { $set: { status: 'active' } },
        )
        .lean()
        .exec();

      await new this.activitiesRepository({
        category: 'admin',
        title: `${adm?.first_name} ${adm?.last_name} pardoned the admin account (${foundAdmin?.first_name} ${foundAdmin?.last_name}) on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Admin account pardoned successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAdmin(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.type !== 'superadmin' &&
        adm.role !== 'manager' &&
        adm.access !== 'read/write'
      ) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'You do not hava necessary privileges for this action',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const foundAdmin = await this.adminRepository.findOne({
        _id: id,
      });
      if (!foundAdmin) {
        throw new HttpException(
          'Admin record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      await new this.activitiesRepository({
        category: 'admin',
        title: `${adm?.first_name} ${adm?.last_name} deleted the admin account (${foundAdmin?.first_name} ${foundAdmin?.last_name}) on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      await this.adminRepository
        .deleteOne({ _id: foundAdmin?.id ?? foundAdmin?._id ?? id })
        .lean()
        .exec();

      return {
        message: 'Admin account deleted successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findBookings(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.appointmentRepository
        .find({})
        .populate(
          'user',
          'first_name last_name email_address phone_number photoUrl',
        )
        .populate('reason')
        .populate('location')
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .exec(),
      this.appointmentRepository.countDocuments(), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }

  async findCurrentAdmin(email_address: string) {
    const admin = await this.adminRepository
      .findOne({ email_address: email_address })
      .lean()
      .exec();

    const { password: ingnore, ...rest } = admin;

    return rest;
  }

  async findBookingsByCategory(page: number, limit: number, category: string) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.appointmentRepository
        .find({
          category: category,
        })
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .populate(
          'user',
          'first_name last_name email_address phone_number photoUrl',
        )
        .exec(),
      this.appointmentRepository.countDocuments({ category: category }), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }

  async findBookingsApproved(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.appointmentRepository
        .find({
          status: { $in: ['booked', 'completed'] },
        })
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .populate(
          'user',
          'first_name last_name email_address phone_number photoUrl',
        )
        .exec(),
      this.appointmentRepository.countDocuments({
        status: { $in: ['booked', 'completed'] },
      }), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }

  async approveBooking(id: string, email_address: string) {
    //First check admin and if they have the right privilege

    const admin = await this.adminRepository
      .findOne({ email_address })
      .lean()
      .exec();

    if (!admin) {
      throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
    }

    if (
      admin.role !== AdminRoles.MANAGER &&
      admin.role !== AdminRoles.DEVELOPER &&
      admin.access !== AccessRights.READ_WRITE
    ) {
      throw new HttpException(
        'You do not have the right privilege.',
        HttpStatus.FORBIDDEN,
      );
    }

    const booking = await this.appointmentRepository
      .findOne({ _id: id })
      .lean()
      .exec();

    if (!booking) {
      throw new HttpException('Booking not found.', HttpStatus.NOT_FOUND);
    }

    const updatedBooking = await this.appointmentRepository
      .updateOne({ _id: booking?._id }, { status: 'booked' })
      .lean()
      .exec();

    return {
      message: 'Appointment approved successfully',
      data: updatedBooking,
    };
  }

  async declineBooking(id: string, email_address: string) {
    //First check admin and if they have the right privilege

    const admin = await this.adminRepository
      .findOne({ email_address })
      .lean()
      .exec();

    if (!admin) {
      throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
    }

    if (
      admin.role !== AdminRoles.MANAGER &&
      admin.role !== AdminRoles.DEVELOPER &&
      admin.access !== AccessRights.READ_WRITE
    ) {
      throw new HttpException(
        'You do not have the right privilege.',
        HttpStatus.FORBIDDEN,
      );
    }

    const booking = await this.appointmentRepository
      .findOne({ _id: id })
      .lean()
      .exec();

    if (!booking) {
      throw new HttpException('Booking not found.', HttpStatus.NOT_FOUND);
    }

    const updatedBooking = await this.appointmentRepository
      .updateOne({ _id: booking?._id }, { status: 'cancelled' })
      .lean()
      .exec();

    return {
      message: 'Appointment approved successfully',
      data: updatedBooking,
    };
  }

  async saveSocial({ logo, name, url }: AddSocialDTO, email_address: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      await new this.socialRepository({
        logo: logo,
        name: name,
        url: url,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();

      await new this.activitiesRepository({
        category: 'social',
        title: `${adm?.first_name} ${adm?.last_name} added a new social platform on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Social platform added successfully.',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async saveBannerAd(
    { amount, endDate, preview, startDate, title, type, url }: AddBannerDTO,
    email_address: string,
  ) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      await new this.bannerRepository({
        amount: amount,
        preview: preview,
        status: 'inactive',
        title: title,
        type: type,
        url: url,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();

      await new this.activitiesRepository({
        category: 'banner',
        title: `${adm?.first_name} ${adm?.last_name} added a new banner advert on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Banner advert added successfully. Awaiting approval',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateBannerAd(
    { status, type, preview, title, url, amount }: any,
    email_address: string,
    id: string,
  ) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      const foundBanner = await this.bannerRepository.findOne({
        _id: id,
      });
      if (!foundBanner) {
        throw new HttpException('Banner not found.', HttpStatus.NOT_FOUND);
      }

      const updatedBanner = await this.bannerRepository
        .updateOne(
          { _id: id },
          {
            status: status,
            type: type,
            preview: preview,
            title: title,
            amount: amount,
            url: url,
          },
        )
        .lean()
        .exec();

      await new this.activitiesRepository({
        category: 'banner',
        title: `${adm?.first_name} ${adm?.last_name} update banner advert (${foundBanner?.title}) on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Banner advert update successfully',
        data: updatedBanner,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteBannerAd(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      const foundBanner = await this.bannerRepository.findOne({
        _id: id,
      });
      if (!foundBanner) {
        throw new HttpException('Banner not found.', HttpStatus.NOT_FOUND);
      }

      await new this.activitiesRepository({
        category: 'banner',
        title: `${adm?.first_name} ${adm?.last_name} update banner advert (${foundBanner?.title}) on ${Date.now().toLocaleString('en-US')}`,
        user: adm?._id ?? adm?.id,
      }).save();

      //       await this.userRepository.updateOne({ _id: userId }, { $set: { status: 'active' } }).exec();
      // await this.bannerRepository.deleteOne({ _id: userId }).exec();

      await this.bannerRepository.deleteOne({ _id: id });

      return {
        message: 'Banner advert deleted successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateSocial(
    { name, logo, url }: any,
    email_address: string,
    id: string,
  ) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      const foundSocial = await this.socialRepository.findOne({
        _id: id,
      });
      if (!foundSocial) {
        throw new HttpException(
          'Social record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedSocial = await this.socialRepository
        .updateOne(
          { _id: foundSocial?.id ?? foundSocial?._id ?? id },
          {
            name: name,
            logo: logo,
            url: url,
          },
        )
        .lean()
        .exec();

      await new this.activitiesRepository({
        category: 'social',
        title: `${adm?.first_name} ${adm?.last_name} updated ${foundSocial?.name} account info on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Social account info update successfully',
        data: updatedSocial,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSocial(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      const foundSocial = await this.socialRepository.findOne({
        _id: id,
      });
      if (!foundSocial) {
        throw new HttpException(
          'Social record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      await new this.activitiesRepository({
        category: 'social',
        title: `${adm?.first_name} ${adm?.last_name} update banner advert (${foundSocial?.name}) on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      await this.socialRepository
        .deleteOne({ _id: foundSocial?.id ?? foundSocial?._id ?? id })
        .lean()
        .exec();

      return {
        message: 'Social account deleted successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getSocials() {
    return await this.socialRepository.find({}).lean().exec();
  }

  async getBanners() {
    return await this.bannerRepository.find({}).lean().exec();
  }

  async getActiveBanners() {
    return await this.bannerRepository.find({ status: 'active' }).lean().exec();
  }

  async manageSettings(
    {
      email_address: appEmail,
      phone_number,
      office_address,
      get_started,
      get_started_title,
    }: any,
    email_address: string,
  ) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      const foundSettings = await this.settingsRepository.find({});
      if (foundSettings.length < 1) {
        // Create new
        await new this.settingsRepository({
          phone_number: phone_number,
          email_address: appEmail,
          office_address: office_address,
          get_started: get_started,
          get_started_title: get_started_title,
          created_at: new Date(),
          updated_at: new Date(),
        }).save();

        await new this.activitiesRepository({
          category: 'settings',
          title: `${adm?.first_name} ${adm?.last_name} initialized platform settings on ${Date.now().toLocaleString('en-US')}`,
          admin: adm?._id ?? adm?.id,
        }).save();
      } else {
        // Update current
        await this.settingsRepository
          .updateOne(
            { _id: foundSettings[0]?.id ?? foundSettings[0]?._id },
            {
              phone_number: phone_number,
              email_address: appEmail,
              office_address: office_address,
              get_started: get_started,
              get_started_title: get_started_title,
            },
          )
          .lean()
          .exec();

        await new this.activitiesRepository({
          category: 'settings',
          title: `${adm?.first_name} ${adm?.last_name} update platform settings on ${Date.now().toLocaleString('en-US')}`,
          user: adm?._id ?? adm?.id,
        }).save();
      }

      return {
        message: 'Operation completed successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async findSettings() {
    return await this.settingsRepository.find({}).lean().exec();
  }

  async allActivities(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.activitiesRepository
        .find({})
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .populate(
          'admin',
          'first_name last_name email_address phone_number photoUrl role type',
        )
        .exec(),
      this.activitiesRepository.countDocuments(), // Count total documents for calculating total pages
    ]);

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      perPage: limit,
    };
  }

  async saveLocation({ region, city }: any, email_address: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      await new this.locationsRepository({
        city: city,
        region: region,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();

      await new this.activitiesRepository({
        category: 'location',
        title: `${adm?.first_name} ${adm?.last_name} added a new location on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Location added successfully.',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateLocation(
    { region, city }: any,
    email_address: string,
    id: string,
  ) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      const foundLocation = await this.locationsRepository.findOne({
        _id: id,
      });
      if (!foundLocation) {
        throw new HttpException(
          'Location record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedLocation = await this.locationsRepository
        .updateOne(
          { _id: foundLocation?.id ?? foundLocation?._id ?? id },
          {
            city: city,
            region: region,
          },
        )
        .lean()
        .exec();

      await new this.activitiesRepository({
        category: 'location',
        title: `${adm?.first_name} ${adm?.last_name} updated location ${foundLocation?.city} on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Location was updated successfully',
        data: updatedLocation,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteLocation(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      const foundLocation = await this.locationsRepository.findOne({
        _id: id,
      });
      if (!foundLocation) {
        throw new HttpException(
          'Location record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      await new this.activitiesRepository({
        category: 'location',
        title: `${adm?.first_name} ${adm?.last_name} deleted location on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      await this.locationsRepository
        .deleteOne({ _id: foundLocation?.id ?? foundLocation?._id ?? id })
        .lean()
        .exec();

      return {
        message: 'Location deleted successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getLocations() {
    return await this.locationsRepository.find({}).lean().exec();
  }

  async saveReason({ title }: any, email_address: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      await new this.reasonsRepository({
        title: title,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();

      await new this.activitiesRepository({
        category: 'location',
        title: `${adm?.first_name} ${adm?.last_name} added a new reason on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Reason added successfully.',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateReason(payload: any, email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      const foundReason = await this.reasonsRepository.findOne({
        _id: id,
      });
      if (!foundReason) {
        throw new HttpException(
          'Reason record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedReason = await this.reasonsRepository
        .updateOne(
          { _id: foundReason?.id ?? foundReason?._id ?? id },
          {
            $set: payload,
          },
        )
        .lean()
        .exec();

      await new this.activitiesRepository({
        category: 'location',
        title: `${adm?.first_name} ${adm?.last_name} updated reason ${foundReason?.title} on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      return {
        message: 'Reason was updated successfully',
        data: updatedReason,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteReason(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      if (
        adm.role !== AdminRoles.MANAGER &&
        adm.role !== AdminRoles.DEVELOPER &&
        adm.role !== AdminRoles.EDITOR &&
        adm.access !== AccessRights.READ_WRITE
      ) {
        throw new HttpException(
          'You do not have the right privilege.',
          HttpStatus.FORBIDDEN,
        );
      }

      const foundReason = await this.reasonsRepository.findOne({
        _id: id,
      });
      if (!foundReason) {
        throw new HttpException(
          'Reason record not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      await new this.activitiesRepository({
        category: 'reason',
        title: `${adm?.first_name} ${adm?.last_name} deleted location on ${Date.now().toLocaleString('en-US')}`,
        admin: adm?._id ?? adm?.id,
      }).save();

      await this.reasonsRepository
        .deleteOne({ _id: foundReason?.id ?? foundReason?._id ?? id })
        .lean()
        .exec();

      return {
        message: 'Reason deleted successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async getReasons() {
    return await this.reasonsRepository.find({}).lean().exec();
  }
}
