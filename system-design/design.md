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

1. Display all products on sale
- user visits the website and is able to see a page with all of the available products

2. View product information page
- when user clicks on an individual product, they are able to see all available information and make a purchase of the product

3. Buy a product
- users are able to add buy a single product or add to cart to buy a product
- product qty_available decrements by quantity purchased
- for each item purchased in the user_shopping_cart, update purchased_at timestamp

4. Admin adds a product
- admins are able to add a new product with name, description, upload image, and qty_available inputs

5. View Shopping Cart
- user should be able to add products to a shopping cart for later viewing and purchasing
- user clicks on a cart and views items that have been added (and not already purchased)

6. View Orders
- when a user clicks view orders, users can view their own orders based on user id

7. User Signup
- user signs up via Better Auth. Better Auth used throughout to check if user has proper access token when navigating throughout the site. 

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

users
- id
- name
- email
- created_at
- updated_at


user_shopping_cart_items
- id
- user_id
- product_id
- item_qty
- added_at
- removed_at
- purchased_at

products
- id
- name
- description
- price
- image_url
- qty_available
- created_by_user_id
- created_at
- updated_at

orders
- id
- user_id
- total_amount
- total_sales_tax
- total_shipping
- total_discounts
- purchased_at
- updated_at

order_line_items
- id
- order_id
- product_id
- sales_line_amount
- qty_purchased
- discount_amount

Questions:
1. What products are for sale
`select * from products where qty_available != 0`

2. What information about a product?
`select * from products where id = ${productId}`

3. How to make a purchase?
`if qty_purchased <= qty_available, INSERT into sales AND UPDATE products table qty_available = qty_available - qty_purchased`


4. View User Shopping Cart
`select from user_shopping_cart_items where user_id = ${userId}`


## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.

1. GET /products
- **Inputs:** none  
- **Outputs:** `Product[]`

2. GET /products/:id
- **Inputs:** productId 
- **Outputs:** `Product`

3. POST /order
- **Inputs:** userId, Order, OrderLineItem[]
- **Outputs:** `Order`, OrderLineItem[], updates shopping cart

4. GET /purchases
- **Inputs:** userId
- **Outputs:** `Order[]`

4. Post /product/:id/create
- **Inputs:** Product
- **Outputs:** `Product`

