/** Unique identifier (uuid string). */
export type ID = string

/** ISO-8601 date-time string, e.g. "2026-06-16T10:00:00.000Z". */
export type ISODateString = string

/** Fields shared by every persisted entity. */
export interface BaseEntity {
  id: ID
  createdAt: ISODateString
  updatedAt: ISODateString
}
