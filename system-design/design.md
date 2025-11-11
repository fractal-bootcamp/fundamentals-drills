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

Key Constraint for V1: User must log in before gaining access to storefront display upon initial landing
V2: transition to modern design of user auth upon checkout or open storefront for unauthenticated storefront view.

Focus on the path of a request and what data is read or written.

  - Storefront displaying all products on sale
  User visits homepage to see a 2d display of all available items that can be bought on the storefront.
  A user clicks on an item that they are interested in purchasing, then gets redirected to the item's page.
  Relevant information about the item (image, description, quantity) are displayed on the item's page.
  - Ability to buy products
  Once a user chooses the quantity of item that wants to be purchased, it gets added to their cart.
  Once the user is satisfied with the items within their cart, they click on their cart (icon on top right)
  and get redirected to their cart's page, where they "check out" their purchases. The cart's contained items,
  desired quantities, and a snippet of the items description are displayed as a vertical list. Once the user
  clicks a button called "Check out" to confirm their purchase, the items within the cart are removed from the
  storefront's display of all available items. 
  - Store admin adds more products
  On the storefront's homepage, if the logged in user has admin roles enabled, a button is available for the
  admin to be redirected to the backend page, where they can create a new item entry that can be added to our
  storefront. A form field that gathers all the relevant data is submitted by our admin to our database

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Key V1 Decision: Storing carts of users as its own table, being able to handle multiple users wanting to buy the same items; having a persistent
record of when an item was placed on a cart can be a useful way to handle race conditions of purchases between users. And also having a history
of what is in the cart when the user logs back into the storefront is useful data to receive in the client from our server.
  - User
    id: uuid (Primary Key)
    name: string
    password: string
    email: string
    mailingAddress: sting
    isAdmin: boolean
  - Cart
    user: uuid (Primary Key)
    items: CartItem[]
  - Items
    id: uuid (Primary Key)
    name: string
    image: string (url of asset)
    quantity: number
    description: string
  - CartItem
    id: uuid (from Items, Primary Key)
    quantity: number
    timeAdded: DateTime

## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

  `GET /items`
  Input: none
  Output: JSON of Items
  `GET /items/{id}`
  Input: id from params
  Output: JSON body of uuid item entry
  `POST /items`
  Input: req.body of Item fields
  Output: JSON of new item, with UUID and db fields
  `GET /cart`
  Input: user uuid
  Output: Cart object
  `POST /cart`
  Input: Cart JSON
  Output: Cart object
  

State what each returns on success and what errors matter in V1.