import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddMarketplaceItem } from './dto/AddMarketplaceItem';
import { MarketPlace } from 'src/schemas/marketplace.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Repository } from 'typeorm';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel(MarketPlace.name)
    private marketplaceRepository: Model<MarketPlace>,
  ) {}

  async addMarketplaceItem({
    amount,
    detail,
    images,
    title,
  }: AddMarketplaceItem) {
    const newMarketplace = new this.marketplaceRepository({
      amount: amount,
      details: detail,
      images,
      title,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return newMarketplace.save();
  }

  async updateMarketplaceItem(payload: AddMarketplaceItem, id: any) {
    if (!payload) {
      throw new HttpException('Payload not provided!', HttpStatus.BAD_REQUEST);
    }

    const item = await this.marketplaceRepository.findOne({
      email_address: id,
    });
    if (!item)
      throw new HttpException('No record found.', HttpStatus.NOT_FOUND);

    await this.marketplaceRepository.updateOne(id, { ...payload });
    const updatedItem = await this.marketplaceRepository.findOne({
      id,
    });

    return updatedItem;
  }

  async all(page: number, limit: number) {
    const skip = (page - 1) * limit; // Calculate the number of records to skip

    const [data, total] = await Promise.all([
      this.marketplaceRepository
        .find({})
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
