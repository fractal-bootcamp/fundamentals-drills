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

### A user logs in and finds a storefront that shows a list of products from a variety of stores.
- The storefront displays a list of products that can link either to a storepage or a product page.
- The list of products are retrieved from the database of stores' choice of "key product" to provide equal representation to the stores available.

### On a given product page, a user may add any number of products to their cart, which will aggregate these for a user until purchase.
- A user can modify the product's types and colours in order to save specific product variation details in their cart.
- By clicking the "add to cart" button, a user can prepare a purchase request.
- They can navigate to other pages in order to add other products before purchase.

### On the cart page, a user can modify their cart selection.
- The cart provides additional key details of the items within, as well as the price and quantity.
- They can choose to modify the quantities of items they are purchasing.

### A store's admin is able to manage their stores' inventory and stock at their storefront page.
- They can add more products to their particular store. They will need to enter in product information such as price, stock, product images, product descriptions, and (possibly) shipping estimates.
- They can additionally halt/pause sales and place additional temporary descriptions for prospective purchasers.

## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

### Tables
Store represents a specific storefront or brand.
- id :: uuid pk
- contact :: fk to user with isAdmin role
- name :: string of store name
- icon :: link to image
- featured_item :: fk to item
- isOpen :: boolean. affects if all items are available for sale.
- message :: string. store-wide message that appear in addition to item descriptions.


Item
- id :: uuid pk
- picture :: link to image
- name :: string
- description :: string
- stock :: non-negative integer
- price :: non-negative currency number
- isPublished :: boolean. affects whether this item is currently available for sale


Item Picture
- id :: pk
- link :: link to image
- item_id :: uuid; fk to item

Cart Row
- user_id :: fk to user (as child item)
- item_id :: fk to item
- quantity :: non-negative integer
- listed_price (calculated)

User
- id :: uuid
- name :: string
- email :: string
- is_admin :: boolean

### Queries

Storefront Display: Retrieve key item details from every store
- for store in Store
  - retrieve store.featured_item, store.name
  - for item in Items where item.id == store.featured_item
    - retrieve item.name, item.picture, item.description
    
Add to cart
- input :: selected item, user
  - create a new Cart Row (cr)
    - already given item_id and user_id;
    - increment the quantity if exists; create a row otherwise.


## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

```mermaid
subgraph client [cli]
  react_components
  react_components --"GET /"-->express
end


subgraph server [serv]
  vite --"react /index"--> react_components
  express ---->
end

subgraph database [db]
  store
  item
  item_picture
  cart_row
  user
end

```



## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.