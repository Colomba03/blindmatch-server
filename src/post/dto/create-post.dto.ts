import { IsOptional, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @IsOptional() 
  readonly communityId?: number;

  @IsInt()
  @IsNotEmpty()
  readonly userId: number; 

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
