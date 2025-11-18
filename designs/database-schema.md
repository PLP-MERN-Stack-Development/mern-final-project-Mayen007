# Database Schema Design for Event Management System

## Overview

Using MongoDB with Mongoose for schemas. Collections: Users, Events, Registrations, Tickets.

## User Schema

- \_id: ObjectId (auto)
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: 'attendee', 'organizer', 'admin', default: 'attendee')
- createdAt: Date (default: now)

## Event Schema

- \_id: ObjectId (auto)
- title: String (required)
- description: String (required)
- date: Date (required)
- time: String (required)
- location: String (required)
- capacity: Number (required)
- organizer: ObjectId (ref: 'User', required)
- category: String (enum: 'conference', 'workshop', 'concert', etc.)
- price: Number (default: 0) // for ticket pricing
- createdAt: Date (default: now)

## Registration Schema

- \_id: ObjectId (auto)
- user: ObjectId (ref: 'User', required)
- event: ObjectId (ref: 'Event', required)
- ticketType: String (enum: 'standard', 'vip', default: 'standard')
- quantity: Number (required, min: 1)
- totalPrice: Number (required)
- status: String (enum: 'pending', 'confirmed', 'cancelled', default: 'pending')
- createdAt: Date (default: now)

## Ticket Schema

- \_id: ObjectId (auto)
- registration: ObjectId (ref: 'Registration', required)
- ticketNumber: String (unique, generated)
- qrCode: String (optional, base64 or URL)
- issuedAt: Date (default: now)

## Relationships

- User -> Registrations (one-to-many)
- Event -> Registrations (one-to-many)
- Registration -> Tickets (one-to-many)

## Validation Rules

- Email format validation
- Password strength (min 6 chars)
- Capacity check on registration (ensure available spots)
- Unique constraints on email, ticketNumber

## Indexes

- Users: email
- Events: date, category
- Registrations: user, event
- Tickets: ticketNumber

## Notes

- Use Mongoose middleware for password hashing, timestamps
- Populate refs in queries for full data
- Link to wireframes: Event list uses Event schema fields, Registration form uses Registration schema
