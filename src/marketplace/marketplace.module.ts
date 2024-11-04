import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketPlace, MarketPlaceSchema } from 'src/schemas/marketplace.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarketPlace.name, schema: MarketPlaceSchema },
    ]),
  ],
  providers: [
    // {
    //   provide: 'HISTORY_SERVICE',
    //   useClass: HistoryService,
    // },
    MarketplaceService,
  ],
  controllers: [MarketplaceController],
})
export class MarketplaceModule {}
