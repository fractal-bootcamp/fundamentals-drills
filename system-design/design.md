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

1. User accesses storefront with products listed
    - product list read from db 
    - GET /products -> db call
2. User adds an item to a "shopping cart"
    - no change to db
    - POST /shoppingCart
3. User removes an item from a "shopping cart"
    - no change to db
    - POST /shoppingCart 
3. User clicks "buy" on a product
    - product is removed from the products db 
    - POST /shoppingCart/buy -> db call
    - purchase history of product is updated
    - POST /shoppingCart/buy -> db call
3. User (admin) adds new products to page
    - product is added to products db
    - UPDATE manually within db

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Product Table
- Product ID
- product description
- product image
- source of product (for admin purposes)
- number available within inventory
- availability for purchase
- date added
- UserID of who modified the product
- action on item- add, remove


Purchase History of Products
- userID of purchaser
- product ID
- date/time of purchase
- count of product purchased

## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.



## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

- GET /products from db
- POST /shoppingCart
    - info about addition or removal of product from cart is within the response body
- POST /shoppingCart/buy 
    - info about product to remove from db is within the response body
    - purchase history about the product is within the response body






State what each returns on success and what errors matter in V1.