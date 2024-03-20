# Backoffice BE Backend

## Overview
This project is a back-end solution designed for back-office operations, focusing on authentication and customer management. It's built using Express.js for the server framework, MySQL for the database with mysql2 as the driver, and a combination of jsonwebtoken, bcrypt, passport, passport-jwt, and passport-local for authentication.

## Features
- **Authentication:** Secure login system with the capability for authorized users to create more users.
- **Customer Management:** 
    - Retrieve a list of customers with support for various queries such as age range, date of birth range, and search by name or number.
    - Get detailed information about a single customer by ID.
    - Update customer information by ID.
    - Delete a customer record by ID.
