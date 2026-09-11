import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { TrainingsService } from "./trainings.service";

import { Public } from "../auth/access";

@Public()
@Controller("trainings")
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Get()
  findAll() {
    return this.trainingsService.findAll();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    const training = this.trainingsService.findOneBySlug(slug);

    if (!training) {
      throw new NotFoundException("Training not found");
    }

    return training;
  }
}
