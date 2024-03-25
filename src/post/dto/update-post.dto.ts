import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto {
    readonly title?: string;
    readonly content?: string;
  }
