import { Module } from '@nestjs/common';
import { BooksModule } from './modules/books/books.module';
import { UsersModule } from './modules/users/users.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [BooksModule, UsersModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
