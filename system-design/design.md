# Objective

Design a minimal Etsy shop with the following features:
 - Storefront displaying all products on sale
 - Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
 - Store admin can manually add more products

## 1. Core User Flows

See products
* user logs in
* visits store page
* sees a list of products

User buys a product
* user sees the list of products
* user selects one product
* user presses 'buy'
* user enters payment info
* product is deleted from db

Admin adds a product
* admin logs in
* sees a list of products
* presses a button to open a 'new product' form
* adds product info in form
* product is added to db

 ## 2. Data models
 User
 * id: uuid (not null, unique)
 * name: string
 * email: string (not null)
 * Auth (e.g. BetterAuth: password, etc.) (not null)
 * admin: boolean

 Products
 * id: uuid (not null, unique)
 * name: string (not null)
 * description: string (if you insist)
 * price: integer (in cents) (not null, > 0)

## 3. Architecture Diagram
client: react
server: express
db: sql

## 4. API Sketch
* GET "/products" (response: json array of products) (select {name, id, description} from products)
* GET "/product/:id" (request: product id. response: json of product data) (select * from products where productId===id)
* POST "/product/:id/delete" ('buy'. request: productId, payment info, validate Auth. response: success or error(couldn't delete/buy)) (delete from products where productId===id)
* POST "/product/create" (request: product object (name, desc, price), validate Auth, validate admin. response: returns object or error(couldn't create)) (insert products {product key/values})