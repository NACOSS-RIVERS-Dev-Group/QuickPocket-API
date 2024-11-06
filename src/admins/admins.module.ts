import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activities, ActivitiesSchema } from 'src/schemas/activities.schema';
import { Admin, AdminSchema } from 'src/schemas/admin.schema';
import {
  Appointment,
  AppointmentSchema,
} from 'src/schemas/appointments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Activities.name, schema: ActivitiesSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
