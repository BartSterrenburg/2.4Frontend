USE [TheCircleAuth]
GO
/****** Object:  Table [dbo].[user]    Script Date: 19-6-2025 10:59:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[publicKey] [text] NULL,
	[createdAt] [datetime] NOT NULL,
	[lastLogin] [datetime] NULL,
	[passwordHash] [nvarchar](255) NOT NULL,
	[salt] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_cace4a159ff9f2512dd42373760] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[verify_log]    Script Date: 19-6-2025 10:59:22 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[verify_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NOT NULL,
	[data] [text] NOT NULL,
	[signature] [text] NOT NULL,
	[publicKeyUsed] [text] NULL,
	[result] [nvarchar](255) NOT NULL,
	[reason] [text] NULL,
	[timestamp] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_06f5ad98aee1cac754ed547cc89] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[user] ADD  CONSTRAINT [DF_e11e649824a45d8ed01d597fd93]  DEFAULT (getdate()) FOR [createdAt]
GO
ALTER TABLE [dbo].[verify_log] ADD  CONSTRAINT [DF_10908a1375ebc6ffe84f3bf6c8b]  DEFAULT (getdate()) FOR [timestamp]
GO
