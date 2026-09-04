CREATE TABLE `Documents` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`Title` text NOT NULL,
	`Subject` text NOT NULL,
	`Content` text NOT NULL,
	`TypeState` text NOT NULL,
	`FileId` text,
	`Metadata` text DEFAULT '{}' NOT NULL,
	`CreatedAt` text DEFAULT (time_fmt_iso(time_now())) NOT NULL,
	`UpdatedAt` text DEFAULT (time_fmt_iso(time_now())) NOT NULL,
	FOREIGN KEY (`TypeState`) REFERENCES `TypeStateDocument`(`Type`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`FileId`) REFERENCES `Files`(`Id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Document_FileId` ON `Documents` (`FileId`);--> statement-breakpoint
CREATE TABLE `TypeStateDocument` (
	`Type` text PRIMARY KEY NOT NULL,
	`Metadata` text DEFAULT '{}' NOT NULL
);
