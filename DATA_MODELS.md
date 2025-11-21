# 🗄️ Reviwa Data Models

## 📋 **Overview**

This document defines the MongoDB data models for the Reviwa environmental platform. All models support the sustainability tracking features and waste management workflows.

---

## 👤 **User Model**

### **Schema Definition**

```javascript
const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    // Environmental Engagement
    role: {
      type: String,
      enum: ["citizen", "admin", "ngo", "researcher"],
      default: "citizen",
    },

    // Community Engagement
    ecoPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Profile Information
    profile: {
      avatar: String, // Cloudinary URL
      bio: {
        type: String,
        maxlength: 500,
      },
      location: {
        district: String,
        city: String,
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
        },
      },
      phoneNumber: {
        type: String,
        validate: {
          validator: function (v) {
            return /\d{10,15}/.test(v);
          },
          message: "Invalid phone number",
        },
      },
    },

    // Environmental Impact Tracking
    environmentalEngagement: {
      reportsSubmitted: { type: Number, default: 0 },
      eventsOrganized: { type: Number, default: 0 },
      eventsAttended: { type: Number, default: 0 },
      votescast: { type: Number, default: 0 },
      proposalsCreated: { type: Number, default: 0 },
      communityLevel: {
        type: String,
        enum: ["observer", "participant", "advocate", "leader"],
        default: "observer",
      },
    },

    // System Fields
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "profile.location.coordinates": "2dsphere" });
userSchema.index({ ecoPoints: -1 });
```

### **User Roles & Permissions**

| Role           | Permissions                   | Description                       |
| -------------- | ----------------------------- | --------------------------------- |
| **citizen**    | Report, Vote, Participate     | Regular community members         |
| **admin**      | Manage, Verify, Moderate      | Municipal/platform administrators |
| **ngo**        | Coordinate, Organize, Support | NGO partners and coordinators     |
| **researcher** | Access, Analyze, Export       | Academic and policy researchers   |

---

## 🗑️ **Report Model**

### **Schema Definition**

```javascript
const reportSchema = new mongoose.Schema(
  {
    // Report Identity
    reportId: {
      type: String,
      unique: true,
      default: () =>
        `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },

    // Reporter Information
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Waste Site Details
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },

    // Location Data (Critical for environmental mapping)
    location: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
      address: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        default: "Default City",
      },
      landmark: String,
      accessibilityNotes: String, // For cleanup crews
    },

    // Visual Evidence
    images: [
      {
        url: {
          type: String,
          required: true,
        }, // Cloudinary URL
        publicId: String, // Cloudinary public ID
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Waste Classification
    wasteType: {
      type: String,
      enum: [
        "household",
        "construction",
        "electronic",
        "medical",
        "industrial",
        "organic",
        "plastic",
        "mixed",
        "other",
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    estimatedVolume: {
      type: String,
      enum: ["small", "medium", "large", "massive"],
      default: "medium",
    },

    // Environmental Workflow Status
    status: {
      type: String,
      enum: ["pending", "verified", "in-progress", "resolved", "rejected"],
      default: "pending",
    },

    // Verification & Resolution
    verification: {
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
      verificationNotes: String,
      priorityLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },
    },

    resolution: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      resolvedAt: Date,
      resolutionMethod: {
        type: String,
        enum: ["municipal", "community", "ngo", "private", "other"],
      },
      resolutionNotes: String,
      beforeAfterImages: [
        {
          url: String,
          publicId: String,
          type: {
            type: String,
            enum: ["before", "after"],
          },
        },
      ],
    },

    // Community Engagement
    communitySupport: {
      upvotes: { type: Number, default: 0 },
      urgencyVotes: { type: Number, default: 0 },
      volunteersOffered: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    // System Tracking
    isPublic: {
      type: Boolean,
      default: true,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    flagReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
reportSchema.index({ status: 1 });
reportSchema.index({ wasteType: 1 });
reportSchema.index({ "location.coordinates": "2dsphere" });
reportSchema.index({ "location.district": 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ reporter: 1 });
```

---

## 🤝 **Event Model** (Community Cleanup Events)

### **Schema Definition**

```javascript
const eventSchema = new mongoose.Schema(
  {
    // Event Identity
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    // Event Organization
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coOrganizers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Event Details
    eventType: {
      type: String,
      enum: ["cleanup", "awareness", "training", "planning", "celebration"],
      default: "cleanup",
    },

    // Location & Timing
    location: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
      address: {
        type: String,
        required: true,
      },
      district: String,
      meetingPoint: String,
      accessibility: String,
    },

    schedule: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      registrationDeadline: Date,
      duration: Number, // in hours
    },

    // Participation Management
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        attended: {
          type: Boolean,
          default: false,
        },
        role: {
          type: String,
          enum: ["participant", "volunteer", "leader"],
          default: "participant",
        },
      },
    ],

    capacity: {
      maxParticipants: Number,
      currentCount: {
        type: Number,
        default: 0,
      },
    },

    // Related Reports
    targetReports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],

    // Resources & Requirements
    resources: {
      materialsProvided: [String], // ["gloves", "bags", "tools"]
      materialsNeeded: [String],
      sponsorLogos: [String], // Cloudinary URLs
      equipment: [String],
    },

    // Impact Tracking
    impact: {
      wasteCollectedKg: Number,
      areaCleanedM2: Number,
      volunteersParticipated: Number,
      reportsResolved: Number,
      beforeAfterPhotos: [
        {
          url: String,
          publicId: String,
          type: {
            type: String,
            enum: ["before", "during", "after"],
          },
        },
      ],
    },

    // Event Status
    status: {
      type: String,
      enum: ["planned", "active", "completed", "cancelled"],
      default: "planned",
    },

    // Public/Community Features
    isPublic: {
      type: Boolean,
      default: true,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ status: 1 });
eventSchema.index({ "schedule.startDate": 1 });
eventSchema.index({ "location.coordinates": "2dsphere" });
eventSchema.index({ organizer: 1 });
```

---

## 🌱 **Proposal Model** (Environmental Action)

### **Schema Definition**

```javascript
const proposalSchema = new mongoose.Schema(
  {
    // Proposal Identity
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },

    // Proposer Information
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Proposal Classification
    category: {
      type: String,
      enum: [
        "policy",
        "infrastructure",
        "community-program",
        "resource-allocation",
        "cleanup-campaign",
        "awareness",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Geographic Scope
    scope: {
      type: String,
      enum: ["neighborhood", "district", "city", "regional"],
      required: true,
    },
    affectedArea: {
      district: String,
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },

    // Community Voting
    voting: {
      supportVotes: { type: Number, default: 0 },
      opposeVotes: { type: Number, default: 0 },
      abstainVotes: { type: Number, default: 0 },
      totalParticipants: { type: Number, default: 0 },

      voters: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          vote: {
            type: String,
            enum: ["support", "oppose", "abstain"],
          },
          comment: String,
          votedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      votingDeadline: Date,
      quorumRequired: {
        type: Number,
        default: 10,
      },
    },

    // Implementation Details
    implementation: {
      estimatedCost: Number,
      timeframe: String, // "2 weeks", "3 months", etc.
      resources: [String],
      stakeholders: [String],
      successMetrics: [String],
    },

    // Municipal Response
    municipalResponse: {
      reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedAt: Date,
      feedback: String,
      feasibilityScore: {
        type: Number,
        min: 1,
        max: 10,
      },
      status: {
        type: String,
        enum: ["under-review", "approved", "rejected", "needs-revision"],
        default: "under-review",
      },
    },

    // Community Discussion
    discussion: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          maxlength: 1000,
        },
        sentiment: {
          type: String,
          enum: ["positive", "neutral", "negative"],
        },
        postedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Proposal Status
    status: {
      type: String,
      enum: [
        "draft",
        "active-voting",
        "passed",
        "failed",
        "implemented",
        "abandoned",
      ],
      default: "draft",
    },

    tags: [String], // for categorization and search
  },
  {
    timestamps: true,
  }
);

// Indexes
proposalSchema.index({ status: 1 });
proposalSchema.index({ category: 1 });
proposalSchema.index({ proposer: 1 });
proposalSchema.index({ "voting.votingDeadline": 1 });
```

---

## 🏛️ **Organization Model** (NGOs, Municipal Partners)

### **Schema Definition**

```javascript
const organizationSchema = new mongoose.Schema(
  {
    // Organization Identity
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ["ngo", "municipal", "corporate", "academic", "community"],
      required: true,
    },

    // Contact Information
    contact: {
      email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Invalid email"],
      },
      phone: String,
      website: String,
      address: {
        street: String,
        city: String,
        district: String,
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
        },
      },
    },

    // Organization Details
    description: {
      type: String,
      maxlength: 2000,
    },
    logo: String, // Cloudinary URL
    establishedYear: Number,

    // Partnership Details
    partnership: {
      status: {
        type: String,
        enum: ["pending", "active", "suspended", "terminated"],
        default: "pending",
      },
      startDate: Date,
      renewalDate: Date,
      partnershipType: {
        type: String,
        enum: [
          "cleanup-partner",
          "funding-partner",
          "tech-partner",
          "municipal-partner",
        ],
      },
    },

    // Service Areas
    serviceAreas: [
      {
        district: String,
        city: String,
        specialization: [String], // waste types or service types
      },
    ],

    // Representatives
    representatives: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "coordinator", "field-worker", "liaison"],
        },
        permissions: [String],
      },
    ],

    // Impact Metrics
    impact: {
      eventsOrganized: { type: Number, default: 0 },
      reportsSupported: { type: Number, default: 0 },
      volunteersManaged: { type: Number, default: 0 },
      wasteProcessedKg: { type: Number, default: 0 },
      areasServedKm2: { type: Number, default: 0 },
    },

    // Verification Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocuments: [String], // Cloudinary URLs
  },
  {
    timestamps: true,
  }
);

// Indexes
organizationSchema.index({ type: 1 });
organizationSchema.index({ "partnership.status": 1 });
organizationSchema.index({ "contact.address.coordinates": "2dsphere" });
```

---

## 📊 **Analytics Model** (Platform Metrics)

### **Schema Definition**

```javascript
const analyticsSchema = new mongoose.Schema(
  {
    // Time Period
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    // Geographic Scope
    scope: {
      type: String,
      enum: ["global", "city", "district", "neighborhood"],
      default: "city",
    },
    location: {
      city: String,
      district: String,
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },

    // Platform Metrics
    platform: {
      activeUsers: Number,
      newRegistrations: Number,
      totalUsers: Number,
      sessionDuration: Number, // average in minutes
      pageViews: Number,
    },

    // Waste Reporting Metrics
    reports: {
      total: Number,
      newReports: Number,
      verified: Number,
      resolved: Number,
      pending: Number,
      byWasteType: {
        household: Number,
        construction: Number,
        electronic: Number,
        medical: Number,
        industrial: Number,
        organic: Number,
        plastic: Number,
        mixed: Number,
        other: Number,
      },
      averageResolutionTime: Number, // in hours
    },

    // Community Engagement
    community: {
      eventsOrganized: Number,
      eventParticipants: Number,
      proposalsSubmitted: Number,
      votescast: Number,
      discussionComments: Number,
      ecoPointsAwarded: Number,
    },

    // Environmental Impact
    environmental: {
      wasteCollectedKg: Number,
      areasCleanedM2: Number,
      co2ReductionEstimate: Number,
      recyclingRate: Number,
      communityHours: Number,
    },

    // Environmental Action
    environmental: {
      proposalParticipationRate: Number,
      citizenEngagementScore: Number,
      municipalResponseRate: Number,
      policyImplementationRate: Number,
    },

    // System Performance
    technical: {
      apiResponseTime: Number, // average in ms
      uptime: Number, // percentage
      errorRate: Number, // percentage
      mobileUsage: Number, // percentage
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
analyticsSchema.index({ period: 1, date: -1 });
analyticsSchema.index({ scope: 1, "location.city": 1 });
analyticsSchema.index({ date: -1 });
```

---

## 🔧 **Database Configuration**

### **Connection Setup**

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### **Indexes & Performance**

```javascript
// Geographic queries for waste site mapping
db.reports.createIndex({ "location.coordinates": "2dsphere" });
db.events.createIndex({ "location.coordinates": "2dsphere" });

// User engagement queries
db.users.createIndex({ role: 1, isActive: 1 });
db.users.createIndex({ ecoPoints: -1 }); // Leaderboard queries

// Report management queries
db.reports.createIndex({ status: 1, createdAt: -1 });
db.reports.createIndex({ reporter: 1, status: 1 });

// Environmental action queries
db.proposals.createIndex({ status: 1, "voting.votingDeadline": 1 });
db.proposals.createIndex({ category: 1, scope: 1 });
```

---

## 🔒 **Data Security & Privacy**

### **Privacy Compliance**

- Personal data encryption at rest
- Anonymized public data exports
- GDPR-compliant data retention policies
- User consent management for data usage

### **Access Controls**

- Role-based data access permissions
- API rate limiting per user role
- Audit logging for sensitive operations
- Regular security assessments

---

## 📈 **Data Relationships Summary**

```
User ─┬─ Reports (1:many)
      ├─ Events (1:many as organizer)
      ├─ Proposals (1:many as proposer)
      ├─ Event Participants (many:many)
      └─ Proposal Votes (many:many)

Report ─┬─ User (many:1 as reporter)
        ├─ Events (many:many as targets)
        └─ Images (1:many)

Event ─┬─ User (many:1 as organizer)
       ├─ Reports (many:many as targets)
       └─ Participants (many:many Users)

Proposal ─┬─ User (many:1 as proposer)
          ├─ Votes (1:many)
          └─ Comments (1:many)

Organization ─┬─ Users (1:many as representatives)
              ├─ Events (1:many as sponsors)
              └─ Reports (1:many as supporters)
```

This data model supports Reviwa's mission as an environmental sustainability tool for smart waste management, enabling transparent governance, community engagement, and measurable environmental impact.

---

> _"Data is the foundation of environmental decision-making in sustainability technology."_ - Reviwa Team
