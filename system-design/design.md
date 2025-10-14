# Objective

Design a minimal Etsy shop with the following features:
 - Storefront displaying all products on sale
 - Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
 - Store admin can manually add more products

## 1. Core User Flows
For each flow, describe what happens end-to-end with bullet points. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

-users create account/sign in and authenticated with BetterAuth (admins get permissions)
-View storefront, scroll through products
-View product details
-Buy product enter information, address, billing etc.
-Admin adds products/restocks

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Users
	id (primary): uuid
	username: string
	email: email

Products
	id (primary): uuid
	name: string
	description: (what product is, specs, features)
	price: number
	Stock: number inStock

Orders
	id (primary): uuid
	user id
	product id
	quantity: number purchased
	cost: cost of entire order 
	address: address for shipping
	billing info: payment information 

Example Queries SQL 
-Storefront
	SELECT * FROM Products WHERE Stock > 0

-Product details
	SELECT productid FROM Products

- Make an order
	POST orderid TO Orders 


## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.

Etsy:
- POST /signup/{userid}
- GET /signin/{userid}
- GET /store
- GET /store/{productid}
- GET /order/{orderid}
- POST /order/{orderid}
- POST /store/{productid} (admin) 