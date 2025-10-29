import { integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const userAuditFields = {

  createdBy: text("created_by").default(''),
  updatedBy: text("updated_by").default(''),
  deletedAt: timestamp("deleted_at").defaultNow(),
  deletedBy: text("deleted_by").default(''),

  accountStatus: text("account_status").default("active"),
  securityQuestions: jsonb("security_questions").array().default([]),
  securityAnswers: jsonb("security_answers").array().default([]),

  lastSecurityQuestionChange: timestamp("last_security_question_change").defaultNow(),
  lastSecurityAnswerChange: timestamp("last_security_answer_change").defaultNow(),
};
