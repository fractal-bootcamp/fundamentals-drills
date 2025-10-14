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

- User creates a store which they are then the admin of. 
  - Starts on store creation page. User enters store name and description. 
  - From store creation page, a request is sent to create a new store. The server communciates with the database and creates a new store entry with the given name, description, and the user who created it as the store admin.
  - After creating the store, the user is taken to a page where they can start adding products.
  - The flow is then the same as the regular flow of adding products described below.

- Store admin can manually add products to their store.
  - The product creation page has a form that collects the product name, description, price, size options, color options, and stock quantities for each size/color combo (if applicable)
  - By default, if a product doesn't have any size or color variants, it will be created with one product variant with size and color set to null, and only the stock quantity field populated
  - The product creation page also requires one image to be the main product image, and also optionally accepts more images. 
  - When the form is submitted, first the images are uploaded and stored, and if this succeeds without error, the product is created first, including the generated URLs for all relevant images (since they will have already made it to the media server). After the product is created, the product variants are created, including size, color, and stock quanitity for each. 

- Users can browse products on a store's page.
  - When the user visits a store's page, a request is sent to the server which then queries the database to return all product listings for that store. 
  - The server handles pagination and includes the current page in the response to the client so the client knows what page to request next.
  - The client displays a page with a number of products, showing their main image from the products mainImage field, and a place to navigate between pages of products if the store has more than a certain number (that warrants pagination)

- Users can purchase products
  - Users have a separate cart for each individual store, since each order is handled by each store admin. 
  - Users add products to their cart from the product details page. 
  - Each product variant that's added to the cart gets its own cart entry, to keep track of the quantity of each specific product variant that's in the cart. 
  - When the user checks out, the client sends a checkout request specifiying which cart to check out, and the server handles updating the stock quantity of each individual product variant purchased in the database. 
  - The server also handles verifying the cart total and processing the payment (payment processing not being modelled here)

- Store admin can manage existing products.
  - Store admins can see an admin page with a list of all existing products.
  - They can go into product detail pages and update stock quantity, price, product variants, and product images, or delete products. 

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

### Store
- **id**: UUID
- **name**: string
- **description**: string/text field

### Product
- **id**: UUID
- **name**: string
- **description**: string/text field
- **price**: number
- **mainImage**: image URL
- **images**: list of image URLs, nullable

### Product variant
- **id**: UUID
- **productId**: UUID
- **stockQuantity**: number
- **size**: string, nullable
- **color**: string, nullable

### User
- **id**: UUID
- **name**: string
- **password**: hashed password
- **email**: email

### Cart
- **id**: UUID
- **storeId**: UUID
- **userId**: UUID

### CartEntry
- **id**: UUID
- **cartId**: UUID
- **productVariantId**: UUID
- **quantity**: number

## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

I'm sorry if I don't get to this but given that this is just a client talking to a server, which then communicates with a database, I feel like a diagram of this isn't going to add very much information or understanding? (sorry I don't mean to be arrogant)

## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.

- `POST /store/create`: return 200 on success, error if any fields are missing or user isn't logged in
- `POST /store/:id/create_product`: return 200 on success, error if user logged in isn't the store admin, if any fields are missing, or if store doesn't exist
- `POST /store/:store_id/:product_id/create_product_variant`: returns 200 on success, error if user isn't the store admin, if the product or store aren't valid, or if the stock quantity field is missing. 
- `POST /store/:store_id/:product_id/update_product`: update product, either overall product info or specific variant info, including stock quantity. This is specified in POST body, user must be store admin. 

- `DELETE /store/:store_id`: delete store only if logged in user is the store admin
- `DELETE /store/:store_id/:product_id`: delete entire product and all its variants, user must be store admin
- `DELETE /store/:store_id/:product_id/:product_variant_id`: delete product variant, user must be store admin

- `GET /store/:id/:page`: on success, returns store name, descirption, and the given page of store products, and information on pagination (what page are we on, how many pages are there left). Users don't need to be logged in to access this endpoint.
- `GET /store/:id/:product_id`: on success, return product detail, including name, description, image URLs, price, and the information for all product variants. 

- `POST /cart/create`: creates a new cart for the logged in user for a store specified in the POST body.
- `POST /cart/add/:store_id/:product_id`
- `POST /cart/:cart_id/checkout`: Attempts to check out the given cart ID. The user must be logged in as the cart owner. Returns an error if user isn't cart owner, or if cart is invalid in some way (not enough stock of a given product variant, product variants aren't all from the same store, etc)