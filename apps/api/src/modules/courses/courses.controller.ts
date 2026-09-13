import { Body, Controller, Get, Post, Put, Param, Req } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import {
  CourseDto,
  AssignDto,
  ProgressDto,
  NotebookDto,
  SubmitDto,
  ReviewDto,
  QuizDto,
  AccountDto,
} from "./courses.dto";
@Controller("courses")
export class CoursesController {
  constructor(private readonly service: CoursesService) {}
  @Get("me") list(@Req() req: any) {
    return this.service.list(req.user);
  }
  @Get("dashboard") dashboard(@Req() req: any) {
    return this.service.dashboard(req.user);
  }
  @Get("groups") groups(@Req() req: any) {
    return this.service.groups(req.user);
  }
  @Get("admin/users") users(@Req() req: any) {
    return this.service.users(req.user);
  }
  @Post("admin/users") createUser(@Req() req: any, @Body() body: AccountDto) {
    return this.service.createUser(req.user, body);
  }
  @Post("admin/users/:id/reset-link") resetLink(
    @Req() req: any,
    @Param("id") id: string,
  ) {
    return this.service.resetLink(req.user, id);
  }
  @Post() create(@Req() req: any, @Body() body: CourseDto) {
    return this.service.createCourse(req.user, body);
  }
  @Get(":id") course(@Req() req: any, @Param("id") id: string) {
    return this.service.course(req.user, id);
  }
  @Put(":id") update(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: CourseDto,
  ) {
    return this.service.updateCourse(req.user, id, body);
  }
  @Post(":id/clone") clone(@Req() req: any, @Param("id") id: string) {
    return this.service.clone(req.user, id);
  }
  @Post(":id/assign") assign(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: AssignDto,
  ) {
    return this.service.assign(req.user, id, body);
  }
  @Get(":id/state") state(@Req() req: any, @Param("id") id: string) {
    return this.service.state(req.user, id);
  }
  @Get(":id/learners/:userId/state") learnerState(
    @Req() req: any,
    @Param("id") id: string,
    @Param("userId") userId: string,
  ) {
    return this.service.state(req.user, id, userId);
  }
  @Get(":id/learners/:userId/export") export(
    @Req() req: any,
    @Param("id") id: string,
    @Param("userId") userId: string,
  ) {
    return this.service.export(req.user, id, userId);
  }
  @Put(":id/lessons/:lessonId/progress") progress(
    @Req() req: any,
    @Param("id") id: string,
    @Param("lessonId") lessonId: string,
    @Body() body: ProgressDto,
  ) {
    return this.service.progress(req.user, id, lessonId, body.completed);
  }
  @Get(":id/resources/:name") resource(
    @Req() req: any,
    @Param("id") id: string,
    @Param("name") name: string,
  ) {
    return this.service.resource(req.user, id, name);
  }
  @Put(":id/notebook") notebook(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: NotebookDto,
  ) {
    return this.service.saveNotebook(req.user, id, body);
  }
  @Post(":id/submissions") submit(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: SubmitDto,
  ) {
    return this.service.submit(req.user, id, body);
  }
  @Get(":id/submissions/:sid") submission(
    @Req() req: any,
    @Param("id") id: string,
    @Param("sid") sid: string,
  ) {
    return this.service.submission(req.user, id, sid);
  }
  @Put(":id/submissions/:sid/review") review(
    @Req() req: any,
    @Param("id") id: string,
    @Param("sid") sid: string,
    @Body() body: ReviewDto,
  ) {
    return this.service.review(req.user, id, sid, body);
  }
  @Post(":id/quizzes/:qid/attempts") quiz(
    @Req() req: any,
    @Param("id") id: string,
    @Param("qid") qid: string,
    @Body() body: QuizDto,
  ) {
    return this.service.quiz(req.user, id, qid, body);
  }
}
