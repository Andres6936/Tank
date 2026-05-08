CREATE TABLE `Accounts` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`AccountId` text NOT NULL,
	`ProviderId` text NOT NULL,
	`UserId` text NOT NULL,
	`AccessToken` text,
	`RefreshToken` text,
	`IdToken` text,
	`AccessTokenExpiresAt` integer,
	`RefreshTokenExpiresAt` integer,
	`Scope` text,
	`Password` text,
	`CreatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`UpdatedAt` integer NOT NULL,
	FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Accounts_userId_idx` ON `Accounts` (`UserId`);--> statement-breakpoint
CREATE TABLE `ApiKeys` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`ConfigId` text DEFAULT 'default' NOT NULL,
	`Name` text,
	`Start` text,
	`ReferenceId` text NOT NULL,
	`Prefix` text,
	`Key` text NOT NULL,
	`RefillInterval` integer,
	`RefillAmount` integer,
	`LastRefillAt` integer,
	`Enabled` integer DEFAULT true,
	`RateLimitEnabled` integer DEFAULT true,
	`RateLimitTimeWindow` integer DEFAULT 86400000,
	`RateLimitMax` integer DEFAULT 10,
	`RequestCount` integer DEFAULT 0,
	`Remaining` integer,
	`LastRequest` integer,
	`ExpiresAt` integer,
	`CreatedAt` integer NOT NULL,
	`UpdatedAt` integer NOT NULL,
	`Permissions` text,
	`Metadata` text
);
--> statement-breakpoint
CREATE INDEX `apikeys_configId_idx` ON `ApiKeys` (`ConfigId`);--> statement-breakpoint
CREATE INDEX `apikeys_referenceId_idx` ON `ApiKeys` (`ReferenceId`);--> statement-breakpoint
CREATE INDEX `apikeys_key_idx` ON `ApiKeys` (`Key`);--> statement-breakpoint
CREATE TABLE `Sessions` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`ExpiresAt` integer NOT NULL,
	`Token` text NOT NULL,
	`CreatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`UpdatedAt` integer NOT NULL,
	`IpAddress` text,
	`UserAgent` text,
	`UserId` text NOT NULL,
	FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Sessions_Token_unique` ON `Sessions` (`Token`);--> statement-breakpoint
CREATE INDEX `Sessions_userId_idx` ON `Sessions` (`UserId`);--> statement-breakpoint
CREATE TABLE `Users` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`Name` text NOT NULL,
	`Email` text NOT NULL,
	`EmailVerified` integer DEFAULT false NOT NULL,
	`Image` text,
	`CreatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`UpdatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_Email_unique` ON `Users` (`Email`);--> statement-breakpoint
CREATE TABLE `Verifications` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`Identifier` text NOT NULL,
	`Value` text NOT NULL,
	`ExpiresAt` integer NOT NULL,
	`CreatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`UpdatedAt` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `Verifications_identifier_idx` ON `Verifications` (`Identifier`);--> statement-breakpoint
CREATE TABLE `Files` (
	`Id` text PRIMARY KEY DEFAULT (uuid7()) NOT NULL,
	`Name` text NOT NULL,
	`Bucket` text NOT NULL,
	`Mimetype` text NOT NULL,
	`Path` text NOT NULL,
	`Metadata` text DEFAULT '{}' NOT NULL,
	`CreatedAt` text DEFAULT (time_fmt_iso(time_now())) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Files_Path_unique` ON `Files` (`Path`);