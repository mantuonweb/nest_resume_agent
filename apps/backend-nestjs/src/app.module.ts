import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "./config/config.module";
import { AgentModule } from "./agent/agent.module";
import { ResumeModule } from "./resume/resume.module";

@Module({
  imports: [ConfigModule, ResumeModule, AgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
