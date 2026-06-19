import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { SocialModule } from './social/social.module';
import { EmployeeModule } from './employee/employee.module';
import { AIModule } from './ai/ai.module';
import { SalesModule } from './sales/sales.module';
import { PayrollModule } from './payroll/payroll.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    ClientModule,
    SocialModule,
    EmployeeModule,
    AIModule,
    SalesModule,
    PayrollModule,
    StorageModule,
    UsersModule,
    TasksModule,
    NotificationsModule,
    LeavesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
