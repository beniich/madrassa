/**
 * Drizzle ORM Schema — Madrassa App Multitenant
 * Chaque table contient `tenantId` pour l'isolation RLS
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  decimal,
  jsonb,
  index,
  customType,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_32_byte_key_for_dev_mode_only!';
const AES_KEY = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

export const encryptedText = customType<{ data: string; driverData: string }>({
  dataType: () => 'text',
  toDriver(val: string): string {
    if (!val) return val;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', AES_KEY, iv);
    let encrypted = cipher.update(val, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  },
  fromDriver(val: string): string {
    if (!val || typeof val !== 'string' || !val.includes(':')) return val;
    const parts = val.split(':');
    if (parts.length !== 3) return val;
    const [ivHex, authTagHex, encryptedHex] = parts;
    try {
      const decipher = crypto.createDecipheriv('aes-256-gcm', AES_KEY, Buffer.from(ivHex, 'hex'));
      decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return val;
    }
  },
});

// ─── Enums ─────────────────────────────────────────────────────────────────

export const planEnum = pgEnum('plan_type', ['starter', 'pro', 'institution']);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
]);
export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'tenant_admin',
  'teacher',
  'student',
  'parent',
]);
export const genderEnum = pgEnum('gender', ['male', 'female']);

// ─── Tenants ────────────────────────────────────────────────────────────────

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(), // ex: "madrassa-marseille"
  domain: text('domain'),               // domaine personnalisé optionnel
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').default('#f59e0b'),
  firebaseUid: text('firebase_uid').unique(), // compte Firebase admin du tenant
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Subscriptions ──────────────────────────────────────────────────────────

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  plan: planEnum('plan').default('starter'),
  status: subscriptionStatusEnum('status').default('trialing'),

  // Stripe IDs
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),

  // Quotas & metered billing
  baseClassesIncluded: integer('base_classes_included').default(10),
  additionalClassesCount: integer('additional_classes_count').default(0),
  pricePerAdditionalClass: decimal('price_per_additional_class', { precision: 10, scale: 2 }).default('8.00'),

  trialEndsAt: timestamp('trial_ends_at'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  canceledAt: timestamp('canceled_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('subscriptions_tenant_idx').on(table.tenantId),
]);

// ─── Users ──────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  firebaseUid: text('firebase_uid').unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: userRoleEnum('role').default('teacher'),
  avatarUrl: text('avatar_url'),
  phone: encryptedText('phone'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('users_tenant_idx').on(table.tenantId),
  index('users_firebase_idx').on(table.firebaseUid),
]);

// ─── Classes ────────────────────────────────────────────────────────────────

export const classes = pgTable('classes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),          // "Classe 1 - Coran"
  level: text('level'),                  // "Débutant", "Intermédiaire"
  teacherId: uuid('teacher_id'),
  maxStudents: integer('max_students').default(30),
  schedule: jsonb('schedule'),           // [{day, startTime, endTime}]
  room: text('room'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('classes_tenant_idx').on(table.tenantId),
]);

// ─── Students ───────────────────────────────────────────────────────────────

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  classId: uuid('class_id').references(() => classes.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: text('date_of_birth'),
  gender: genderEnum('gender'),
  email: text('email'),
  phone: encryptedText('phone'),
  parentName: text('parent_name'),
  parentPhone: encryptedText('parent_phone'),
  parentEmail: encryptedText('parent_email'),
  enrollmentDate: timestamp('enrollment_date').defaultNow(),
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('students_tenant_idx').on(table.tenantId),
  index('students_class_idx').on(table.classId),
]);

// ─── Teachers ───────────────────────────────────────────────────────────────

export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  phone: encryptedText('phone'),
  speciality: text('speciality'),        // "Coran", "Arabe", "Fiqh"
  salary: encryptedText('salary'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('teachers_tenant_idx').on(table.tenantId),
]);

// ─── Attendance ─────────────────────────────────────────────────────────────

export const attendance = pgTable('attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => students.id),
  classId: uuid('class_id').notNull().references(() => classes.id),
  date: text('date').notNull(),           // ISO date string
  status: text('status').notNull(),       // 'present' | 'absent' | 'late' | 'excused'
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('attendance_tenant_idx').on(table.tenantId),
  index('attendance_date_idx').on(table.date),
]);

// ─── Invoices ───────────────────────────────────────────────────────────────

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').references(() => students.id),
  invoiceNumber: text('invoice_number').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: text('due_date'),
  paidAt: timestamp('paid_at'),
  status: text('status').default('pending'), // 'pending' | 'paid' | 'overdue' | 'cancelled'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('invoices_tenant_idx').on(table.tenantId),
]);

// ─── Audit Logs (global, sans RLS — accessible super admin) ─────────────────

export const auditLogs = pgTable('audit_logs_drizzle', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  userId: text('user_id'),
  action: text('action').notNull(),
  resource: text('resource'),
  resourceId: text('resource_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('audit_tenant_idx').on(table.tenantId),
  index('audit_created_idx').on(table.createdAt),
]);

// ─── AI & RAG ───────────────────────────────────────────────────────────────

const vector = customType<{ data: number[] }>({
  dataType: () => 'vector(768)', // Dimension pour nomic-embed-text
});

export const aiDocuments = pgTable('ai_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  fileName: text('file_name'),
  fileType: text('file_type'),           // 'pdf', 'docx', 'txt', 'grades_export'
  content: text('content'),              // texte brut complet
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('ai_docs_tenant_idx').on(table.tenantId),
]);

export const aiDocumentChunks = pgTable('ai_document_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  documentId: uuid('document_id').notNull().references(() => aiDocuments.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),    // le texte du chunk
  embedding: vector('embedding'),       // le vecteur
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('ai_chunks_tenant_idx').on(table.tenantId),
  index('ai_chunks_doc_idx').on(table.documentId),
]);

// ─── Relations ──────────────────────────────────────────────────────────────

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  subscription: one(subscriptions, {
    fields: [tenants.id],
    references: [subscriptions.tenantId],
  }),
  users: many(users),
  classes: many(classes),
  students: many(students),
  teachers: many(teachers),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [subscriptions.tenantId],
    references: [tenants.id],
  }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  tenant: one(tenants, { fields: [classes.tenantId], references: [tenants.id] }),
  teacher: one(teachers, { fields: [classes.teacherId], references: [teachers.id] }),
  students: many(students),
  attendance: many(attendance),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  tenant: one(tenants, { fields: [students.tenantId], references: [tenants.id] }),
  class: one(classes, { fields: [students.classId], references: [classes.id] }),
  attendance: many(attendance),
  invoices: many(invoices),
}));

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type User = typeof users.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Teacher = typeof teachers.$inferSelect;
export type AttendanceRecord = typeof attendance.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;

// ─── AI Memory Migrated from SQLite ─────────────────────────────────────────

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: text('session_id').notNull(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  role: text('role').notNull(), // 'user', 'assistant', 'system'
  agent: text('agent'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('ai_convs_tenant_idx').on(table.tenantId),
  index('ai_convs_session_idx').on(table.sessionId),
]);

export const aiInsights = pgTable('ai_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  agent: text('agent'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('ai_insights_tenant_idx').on(table.tenantId),
]);

export const aiArtifacts = pgTable('ai_artifacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  studentId: text('student_id'),
  classId: text('class_id'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('ai_artifacts_tenant_idx').on(table.tenantId),
]);
