import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddMarketplaceItem } from './dto/AddMarketplaceItem';
import { MarketPlace } from 'src/schemas/marketplace.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admin.schema';
import { Activities } from 'src/schemas/activities.schema';
// import { Repository } from 'typeorm';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(MarketPlace.name)
    private marketplaceRepository: Model<MarketPlace>,
    @InjectModel(Admin.name) private adminRepository: Model<Admin>,
    @InjectModel(Activities.name)
    private activitiesRepository: Model<Activities>,
  ) {}

  async addMarketplaceItem({
    amount,
    detail,
    images,
    title,
  }: AddMarketplaceItem) {
    const newMarketplace = await new this.marketplaceRepository({
      amount: amount,
      details: detail,
      images,
      title,
      created_at: new Date(),
      updated_at: new Date(),
    }).save();

    return newMarketplace;
  }

  async updateMarketplaceItem(payload: AddMarketplaceItem, id: any) {
    if (!payload) {
      throw new HttpException('Payload not provided!', HttpStatus.BAD_REQUEST);
    }

    const item = await this.marketplaceRepository.findOne({
      _id: id,
    });
    if (!item)
      throw new HttpException('No record found.', HttpStatus.NOT_FOUND);

    await this.marketplaceRepository.updateOne({ _id: id }, payload);
    const updatedItem = await this.marketplaceRepository.findOne({
      _id: id,
    });

    return updatedItem;
  }

  async deleteMarketplaceItem(email_address: string, id: string) {
    try {
      //First check if user exist and marketplace exists
      const adm = await this.adminRepository.findOne({
        email_address: email_address,
      });
      if (!adm) {
        throw new HttpException('No admin found.', HttpStatus.NOT_FOUND);
      }

      const foundItem = await this.marketplaceRepository.findOne({
        _id: id,
      });
      if (!foundItem) {
        throw new HttpException('Banner not found.', HttpStatus.NOT_FOUND);
      }

      await new this.activitiesRepository({
        category: 'product',
        title: `${adm?.first_name} ${adm?.last_name} update banner advert (${foundItem?.title}) on ${Date.now().toLocaleString('en-US')}`,
        user: adm?._id ?? adm?.id,
      }).save();

      await this.marketplaceRepository.deleteOne({ _id: id });

      return {
        message: 'Product deleted successfully',
        data: null,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async all(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.marketplaceRepository
        .find({ deletedAt: null })
        .skip(skip) // Skip the records
        .limit(limit) // Limit the number of records returned
        .exec(),
      this.marketplaceRepository.countDocuments(), // Count total documents for calculating total pages
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
