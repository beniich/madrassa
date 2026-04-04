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
  phone: text('phone'),
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
  phone: text('phone'),
  parentName: text('parent_name'),
  parentPhone: text('parent_phone'),
  parentEmail: text('parent_email'),
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
  phone: text('phone'),
  speciality: text('speciality'),        // "Coran", "Arabe", "Fiqh"
  salary: decimal('salary', { precision: 10, scale: 2 }),
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
