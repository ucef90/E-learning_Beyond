import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller";
import { CoursesService } from "./courses.service";
import { AuthoringController } from "./authoring.controller";
import { AuthoringService } from "./authoring.service";

@Module({
  controllers: [AuthoringController, CoursesController],
  providers: [CoursesService, AuthoringService],
})
export class CoursesModule {}
