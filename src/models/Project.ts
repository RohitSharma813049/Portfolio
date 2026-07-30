import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeature {
  title: string;
  description?: string;
  icon?: string;
}

export interface IPanel {
  name: string;
  description?: string;
  image?: string;
}

export interface IScreenshot {
  url: string;
  type: "DESKTOP" | "MOBILE" | "TABLET" | "VIDEO";
}

export interface IDemoCredential {
  role: string;
  email: string;
  password?: string;
}

export interface IProject extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  featureImage?: string;
  bannerImage?: string;
  status: "DRAFT" | "PUBLISHED" | "BUY" | "CUSTOMIZE" | "UPCOMING";
  
  livePreviewUrl?: string;
  bookDemoUrl?: string;
  requestCostUrl?: string;
  enquiryUrl?: string;
  videoUrl?: string;
  
  hasSourceCode: boolean;
  isWhiteLabel: boolean;
  isCustomizable: boolean;
  hasSubscription: boolean;
  
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  
  categories: string[];
  technologies: string[];
  industries: string[];
  
  features: IFeature[];
  panels: IPanel[];
  screenshots: IScreenshot[];
  credentials: IDemoCredential[];
  
  createdAt: Date;
  updatedAt: Date;
}

const FeatureSchema = new Schema<IFeature>({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
});

const PanelSchema = new Schema<IPanel>({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
});

const ScreenshotSchema = new Schema<IScreenshot>({
  url: { type: String, required: true },
  type: { type: String, enum: ["DESKTOP", "MOBILE", "TABLET", "VIDEO"], default: "DESKTOP" },
});

const DemoCredentialSchema = new Schema<IDemoCredential>({
  role: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
});

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    featureImage: { type: String },
    bannerImage: { type: String },
    status: { type: String, enum: ["DRAFT", "PUBLISHED", "BUY", "CUSTOMIZE", "UPCOMING"], default: "DRAFT" },
    
    livePreviewUrl: { type: String },
    bookDemoUrl: { type: String },
    requestCostUrl: { type: String },
    enquiryUrl: { type: String },
    videoUrl: { type: String },
    
    hasSourceCode: { type: Boolean, default: false },
    isWhiteLabel: { type: Boolean, default: false },
    isCustomizable: { type: Boolean, default: false },
    hasSubscription: { type: Boolean, default: false },
    
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    
    categories: [{ type: String }],
    technologies: [{ type: String }],
    industries: [{ type: String }],
    
    features: [FeatureSchema],
    panels: [PanelSchema],
    screenshots: [ScreenshotSchema],
    credentials: [DemoCredentialSchema],
  },
  { timestamps: true }
);

// Prevent mongoose from recompiling the model upon hot reload
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
