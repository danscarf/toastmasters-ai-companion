// app/_lib/entities/TimerSession.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// This entity will be used to store timer sessions in the Supabase PostgreSQL database.
// It maps directly to the TimerSession interface defined in TimerProvider.tsx,
// with an added userId to associate with the authenticated user.

@Entity()
export class TimerSession {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  speakerName: string | null;

  @Column()
  presetName: string;

  @Column()
  timeRequirement: string;

  @Column("int")
  duration: number; // in seconds

  @Column({ nullable: true })
  isWithinTime: boolean | null;

  @Column("timestamp with time zone")
  timestamp: Date;

  @Column()
  userId: string; // To associate with Supabase user ID
}
