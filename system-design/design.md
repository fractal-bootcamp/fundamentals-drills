# Objective

Design a minimal Etsy shop with the following features:
 - Storefront displaying all products on sale
 - Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
 - Store admin can manually add more products

## 1. Core User Flows
For each flow, describe what happens end-to-end with bullet points. For the Twitter question, this might be:

    The user goes to the storefront page
        - products are displayed with basic information (image, name, price) with a button associated with each product (product information read from the DB Product Table)
        - admin login button in the corner
        - clicking on a given product's button would take them to that product's page
    Each product page would have information about the product
        - description, images, price, if the item is in stock (all read from the DB Product Table entry for that product)
        - a buy button (removes the that item's db entry from the DB Product Table)
    Clicking the buy button would take them to a payment page (remove the item from the DB Products Table by updating the Stock counter)

    If the user is an admin, the would have to login by clicking the admin login button
        Login and authentication would be handled by BetterAuth
        admin would see a list of all products (product information read from the DB Product Table)
        admin would have a button that would allow them to add new products (add a row to the db)
        admin would have a button for each product that would allow them to update the stock of existing products (update the Stock column of the item with that productId in the DB Product Table)

Out of scope things that were considered, but judged to be beyond the scope of the project given the details of the spec:
    - Cart functionality
    - allowing the user to buy directly from the storefront rather than passing through the product page
    - deleting products from the storefront

Focus on the path of a request and what data is read or written.

 ## 2. Data models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

    ProductTable
        ProductId: uuid (potentially with prefix)
        ProductName: string
        Price: number
        Image: string (url of the image)
        ProductDescription: String
        Stock: number

    AdminTable
        id: uuid
        username: string
        email: string

Questions I would ask of my data:

    What products should I display on the storefront/admin page?
        SELECT * FROM ProductTable
    Which product should I display on a product page
        SELECT * FROM ProductTable WHERE ProductId = {ProductId} 
    How will I remove an item once it has been bought:
        UPDATE ProductTable SET Stock = {Stock - 1} WHERE ProductId = {ProductId}
    How will the admin add more of an existing product?
        UPDATE ProductTable SET Stock = {NewStock} WHERE ProductId = {ProductId}
    How will the admin add a new Product?
        INSERT INTO ProductTable {Product}
    Is an item in stock (to show on the product page)
        SELECT Stock FROM ProductTable WHERE ProductId = {ProductId}
            If stock = 0 then its out of stock!

    

## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.
See screenshot in system-design folder


## 4. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

GET /storefront
    Req: None
    Res: Array of product objects
GET /product/id
    Req: ProductId
    Res: Product object for product with that id
POST /product/id/buy
    Req: ProductID
    Res: Updated product object for product with that id, stock decreased by one (this update happens on the db)
    Errors: If stock is 0 then it cant be bought, its out of stock
POST /adminLogIn
    Req: None (but headers probably have special BetterAuth Stuff)
    Res: Redirects to the adminStorefront
    Errors: if the login credentials are rejected by BetterAuth
GET /adminStorefront
    Req: None
    Res: Array of product objects
POST /adminStorefront/createProduct
    Req: Product object for new product
    Res: Updated array of product objects with new product in it
POST /adminStorefront/id/updateStock
    Req: ProductId, new stock value
    Res: Updated array of product objects with the updated stock value for the specified product

State what each returns on success and what errors matter in V1.