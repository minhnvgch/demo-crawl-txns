import { Module } from '@nestjs/common';
import { TestConsole } from 'src/modules/test/test.console';

@Module({
  imports: [],
  controllers: [],
  providers: [TestConsole],
})
export class TestModule {}
