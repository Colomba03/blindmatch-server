export class CreateUserDto {
    readonly name: string;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly birthdate: Date;
    readonly sex: string;
}
