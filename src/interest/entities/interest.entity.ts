import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'interest' })
export class Interest {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}
