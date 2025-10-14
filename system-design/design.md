# Objective

Design a minimal Etsy shop with the following features:
 - Storefront displaying all products on sale
 - Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
 - Store admin can manually add more products

## 1. Core User Flows
For each flow, describe what happens end-to-end with bullet points. For the Twitter question, this might be:
- Visit storefront page
    - View available products
    - Select a specific product
        - View details
        - Purchase
        OR
        -Add to cart
- View shopping cart
    - Remove item from cart
    - Check out
- Inventory page(admin)
    - View current inventory
    - Add product
    - Remove product
Focus on the path of a request and what data is read or written.

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.
- Inventory
    productId: prefixed UUID
    productName: string
    price: number
    quantity: number
    productPhotos: string | string[]
    description: string
- Shoppers
    id: prefixed UUID
    cartContents: productId[] | null



## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

- GET /shop: returns inventory list
- GET /product/id: returns product data
- GET /cart: returns cartContents
- POST /cart: adds product to cartContents
- POST /checkout: removes product from db

State what each returns on success and what errors matter in V1.