import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interests } from 'src/schemas/interests.schema';
import { AddInterestDTO } from './dto/AddInterest.dto';
import { User } from 'src/schemas/user.schema';
import { MarketPlace } from 'src/schemas/marketplace.schema';
import { Notification } from 'src/schemas/notification.schema';

@Injectable()
export class InterestsService {
  constructor(
    @InjectModel(Interests.name)
    private interestRepository: Model<Interests>,
    @InjectModel(User.name)
    private userRepository: Model<User>,
    @InjectModel(MarketPlace.name)
    private marketplaceRepository: Model<MarketPlace>,
    @InjectModel(Notification.name)
    private notificationRepository: Model<Notification>,
  ) {}

  async saveInterest({ marketplaceId }: AddInterestDTO, email_address: string) {
    try {
      //First check if user exist and marketplace exists
      const usr = await this.userRepository.findOne({
        email_address: email_address,
      });
      if (!usr) {
        throw new HttpException('No user found.', HttpStatus.NOT_FOUND);
      }

      const marketItem =
        await this.marketplaceRepository.findById(marketplaceId);
      if (!marketItem) {
        throw new HttpException(
          'Market place item not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      new this.interestRepository({
        user: usr?._id ?? usr?.id,
        marketplace: marketplaceId,
        created_at: new Date(),
        updated_at: new Date(),
      }).save();

      await new this.notificationRepository({
        category: 'interest',
        title: `You showed interest for ${marketItem.title}`,
        user: usr?._id ?? usr?.id,
      }).save();

      return {
        message: "Interest successfully indicated. You'll be contacted",
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async allInterests() {
    try {
      return await this.interestRepository.find();
    } catch (error) {
      console.log(error);
    }
  }
}
