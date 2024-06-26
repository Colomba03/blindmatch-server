import { IsString, IsOptional,IsNotEmpty } from 'class-validator';


export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly title?: string;
  
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    readonly content?: string;
  }
