import { AssistantModule } from "./modules/assistant/assistant.controller";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TrainingsModule } from "./modules/trainings/trainings.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { QuotesModule } from "./modules/quotes/quotes.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { EnrollmentsModule } from "./modules/enrollments/enrollments.module";
import { CommercialModule } from "./modules/commercial/commercial.module";
import { PrismaModule } from "./common/prisma.module";

import { QualityModule } from "./modules/quality/quality.module";
import { APP_GUARD } from "@nestjs/core";
import { AccessGuard } from "./modules/auth/access";
import { ExecutiveModule } from "./modules/executive/executive.controller";

@Module({
  providers: [{ provide: APP_GUARD, useClass: AccessGuard }],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    TrainingsModule,
    CategoriesModule,
    ContactsModule,
    QuotesModule,
    CoursesModule,
    EnrollmentsModule,
    CommercialModule,
    QualityModule,
    AssistantModule,
    ExecutiveModule,
  ],
})
export class AppModule {}
