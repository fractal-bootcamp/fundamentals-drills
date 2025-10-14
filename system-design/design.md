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

flow (user): 
- user opens app, a list of all products on sale come up
- user clicks on product, product details appear (description) and a buy button
- user clicks buy, checkout page appears (quantitiy, address and shipping details, payment skipped)
- user receives checkout confirmation of the product

flow (admin):
- admin opens app, a special page renders, all products are also listed this time accompanied by an add product button
- admin can click on product to view details
- admin can click on add product to render add product inputs: Product name, product description. add product button submits addition and renders on products list
- admin can also access the full user flow. buying a product would remove it from the displayed list

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Tables and columns:
- userId (could be from betterAuth, or our UUID)
- user shipping info
- user's purchases (for confirmation logging)

- product name
- product id
- product description
- product status (available, sold)



## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.



## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

GET endpoints:
- GET /products
Input: none

validate product status

Output: JSON response: product name, product ID, product status (available only)

- GET /products/adminId
input: userId (admin's)
if userId !== adminId, JSON response: Error 500
Output: JSON response: product name, product ID, product status (availability filteration for admin not needed)

- GET /product/{id}
input: productId
Output: product name, product ID, product description

- GET /confirmation
input: 

POST endpoints:
- POST /product (for admin's special page)
input: request body: product
output: JSON response: product
DB insert

- POST /checkout
input: request body: shipping info
output: JSON response: shipping info
DB upsert
product status to sold

State what each returns on success and what errors matter in V1.