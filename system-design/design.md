# Objective

Design a minimal Etsy shop with the following features:
 - Storefront displaying all products on sale
 - Ability to buy products (no need to build payments integation for this exercise; just remove the item from the database when "bought")
 - Store admin can manually add more products

## 1. Core User Flows

    UI components allows navigation to signup/login or existing cart at any point

    storefront page
        get and display all available products from database
        shows price of products
        can visit individual product pages
        button to add to cart

    individual product page
        displays description of product
        shows price of products
        button to add to cart

    cart
        displays items in your cart with totals 
        shipping and payment info from user
        will be protected with a token provided by betterAuth as it has user address data

    admin
        can add products
        protected route only accessible with betterAuth token in req header

    signup/login
        required to checkout
        used to verify admin

 ## 2. Data models
    users
        id: uuid
        name: string
        email: string
        address: string
        role: customer | admin
    
    products
        id: uuid
        name: string
        price: number
        description: string

    carts
        id: uuid
        user: uuid references users
        product: uuid[] references products
        total: number

    select * from carts where User = Users id for // users cart, for count, subtotal, and checkout
    select * from products where cart product id = product id   // display items in cart and price totals

    update products insert values to add products   // add items to store

    select * from products // display storefront

    select * from products where product id // display individual product and description



## 3. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 4. API Sketch
cartId will be generated upon session visit and will go into req header as cookies except for Admin endpoint to help user save current cart status

display all products     GET/ Store
    input: none
    output: product names and prices

display individual products    GET/ store/ID
    input: product id in params
    output: Product name, price, description

add item to cart    POST/ store/:id/add
    input: product
    output: JSON cart

display cart   GET/ Cart/id
    input: cart id
    output: JSON cart 

buy items in cart   POST/ cart/id
    input: cart 
    output: JSON cart, error if order not processed

admin adds items to store     POST/ store/id/add
    input: admin login token from better Auth in headers as cookie
        body contains products to update
    output: JSON products

