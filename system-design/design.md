# Objective

Design a minimal Etsy shop with the following features:

- Storefront displaying all products on sale
- Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
- Store admin can manually add more products

## 1. Core User Flows

For each flow, describe what happens end-to-end with bullet points. For the Twitter question, this might be:
Focus on the path of a request and what data is read or written.

- a user will visit our /index route and a storefront displaying all possible products to buy will be rendered on the client browser.

  - a user should be able to click on an individual product and receive info about the product:
    - price, name, description, photo video or associated media for product

- a user should be able to click 'add to cart' button from the individual product info page

  - the product will be added to the user's cart in a sidebar and display a subtotal along with a running tally of the products that are in the cart.
  - a user should be able to 'remove from cart' if they no longer want the product and subtotal will update.

- an admin user should be able to add and remove approved products from display on the main route.

  - an admin user can add/remove user accounts
  - an admin user can update the database of products appropriately

- user authorization:
  - the admin and user accounts will be handled by an authorization system which has control over our authenticated user's DB's table
  - our authorization system will check if a user's local session has been authenticated already by checking the user's session cookie against a JWT.

## 2. Data models

List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

PRODUCTS:
id: PROD_uuid
name: string
price: number
description: string

USER:
id: USER_uuid
email: string
name: string
password: string
cart: Cart{} containing the products this user currently has in their cart
isAdmin: boolean

## 3. Architecture Diagram

Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 4. API Sketch

List the minimal endpoints and their request/response shapes at a high level. Keep this terse.
State what each returns on success and what errors matter in V1.

- GET /products
  input: a GET request
  output: response of a list of all products to display
  the body will contain an array of all Product{} objects
  return an internal server error if we can't display a list of products available to purchase

- GET /products/{id}
  input: a GET request
  output: response of a single Product{}
  return an eror if the Product{} item doesn't exist

- POST /products/{id}
  input: a POST request to save a Product{} to the products table in our DB
  output: response for that single Product{}
  return an error there's an internal server error

- GET /{userId}/cart

  - input: a GET request to fetch all Prodcuts{} for this user
  - output: all Products{} associated w/ currently authenticated user's cart
  - if user is not found return error
  - if user is found & authenticated but nothing in cart render a message in the front end that user has nothing added to cart

- GET /admin
  - input a GET request to display our admin dashboard as a protected route is authentication is successful
  - output: a response containing the <AdminDashboard/> component
  - if user is not authenticated return an error
