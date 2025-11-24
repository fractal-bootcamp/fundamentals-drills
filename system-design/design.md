# Objective

Design a minimal Etsy shop with the following features:
 - Storefront displaying all products on sale
 - Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
 - Store admin can manually add more products

## 1. Core User Flows
For each flow, describe what happens end-to-end with bullet points. For the Twitter question, this might be:

Ability to view a product in the Storefront
- User views products listed for that particular storefront
- Homepage contains basic information: Product Image, Pricing, Quantity Available
- Clicks on a single product, and gets directed to its specific product listing page.


Ability to View Product Listing and add to cart from Multiple Listings
- View each product page with its description, title, and quantity available.
- User shall add desired quantity into their shopping cart.
- User shall be able to click checkout, or go to another product page and add that to checkout.

Ability to Checkout
- User shall be able to click on checkout from any product page.
- User shall be able to see all their items and their quantity during the checkout stage.
- Before checking out, user shall be prompted to log in (if not done so already), authenticated wiht Better Auth.
- Upon succesfully checking out, the product's available quantity will automatically decrement based on the customer's order.

Ability for Administrator to Add New Products
- Admin will have special privilleges
- Ability for Store Administrator to manually add new products and specify their quantity before listing.
- Authenticate with BetterAuth and use isAdmin flag to check for Admin role.



 ## 2. Data models
Products
 - ProductID: UUID
 - Name : String
 - Description : String
 - Quantity_Available: Number

Customers
 - ID: UUID
 - Name: String
 - Email: String
 - Address: String

Order 
 - OrderID : UUID
 - CustomerID : UUID (FK)
 - Address : String
 - Subtotal : Number
 - Total : Number
 - Shipping : Number
 - Tax : Number

 Product_Order Bridge Table
 - ProductID: FK
 - OrderID: FK
 - Quantity



1) ADD NEW Products:
UPDATE Products
SET Name = ... , Description = ..., Quantity_Available = ...

2) New Orders:
UPDATE Order
SET Order_ID = .... , CustomerID = ... 

UPDATE Product_Order
SET ProductID = ... , OrderID = ..., Quantity = ... 


3) Add New Customer (during Login)
UPDATE Customers
SET Name = ..., Email = ... , Address = ....


4) View all Products
SELECT * FROM Products

5) View specific Products
SELECT * FROM Products WHERE ProductID = .....



## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

[Vite | Express / React Router Framework Mode] => On the same port

React Router calls Database through Drizzle's ORM 
## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

For twitter:
- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.

GET /Products

GET /Products/P_ID

POST /Products/
Body: Name, Description, Quantity Available

Delete /Products/P_ID

POST /Order/C_ID
C_ID: CustomerID
Body: An array of the ProductID and Quantities