# Paris Mitton on System Design

## Emphatic Walk-Through


### example for today: Campground Reservation System

1. **Core User Flow (done first!!)**
- Breaks down assignment bullets into user story
- Imagine the relevant info displayed to user: db to screen
- Elaborate on user feedback: what's the UI? the components?
- Be ruthless and build exactly to spec! Limit complexity
- Care more about data modeling than runtime details
- Hammering the point: out of spec, out of mind.

2. **Data Models**
- Extrapolate relevant data from user flow
- "What's the container?" the campground! that's scope.
- "What does it mean for X to exist?"
- Highly structured vs generalized tradeoff:
  - "What needs to be displayed?" (see abstraction)
- "What data is coupled?" Useful for encoding functionality
- Paris: "The concept of something is separate from its name..." BANGER
- 'serial' as internal db tracker vs 'uuid' as rng & separate from db
- Drew: Data model design is contentious, build out toolbelt data types and models from seniors 
  - Data is foundational to your design, getting *enough* right ASAP is critical!
- Associate relevant fields between DBs
- "What data is useful to know?" Data becomes features
- "Extremely functional yet basic", "Strictly feasible"
- Paris: "Not adding the right abstraction is painful"
  - War Story on preemptively modeling fields
  - "One user using outdated field = pain"
- Running through data model helps simplify abstractions
  - Calendar DB unnecessary when Booking DB has start & end date
- *SYSTEM CRITICAL DESIGN LOOP*
  - "What questions do I need to ask of my data?"
  - "How fast do I need to answer them?"
- You're good if:
  - your data model can answer those two questions easily (conceptual clarity!)
  - your model easily references back to your core user flows
  - SQL calls naturally query out of your model

3. **Architecture Diagram**
- Answers the question: "What tech do we need?"; these are our boxes.
- Three major "boxes": client, server, database
- Inner boxes: "What's serving what?"
  - Eg. "Vite" (serving html + jsx) separate from "Express" (serving data endpoints)
- "Arrows": initial data flows (see 1), labeled data endpoints
- "Client Box": labeled components, routes and pages
- "Server Box": utils files, handlers, ORMs
- "Database Box": data model, schema titles (see 2)
- Arrange inner boxes according to what pieces are relevant to data flows / "arrows"
  - Eg. "Vite + Express boxes" on left side of server box, "Drizzle ORM box" on right side

4. **API Sketch**
- Recipe:
  - Route: GET | POST `/url` 
  - Inputs: Data model/types
  - Outputs: JSON, db info
  - e.g. 
    - GET `/campsite/{id}/booking`
    - Inputs: (req.body): Booking id field
    - Outputs: JSON Booking data | Error
- Isolate endpoints based on potential calls
- Anticipate over time what is most used in your design
- KEY: "Can you construct these features based on your endpoints?"
- `/delete` used now over HTTP DELETE verb
- API Sketch syntax similar to RPC API libraries (tRPC, GraphQL)
- Modern paradigm: HTTP is a transport mechanism for server calls
- "{Now} all my browser does is download and run programs"
  - once upon a time, the web used to be a document server...
- GET requests cannot contain req.bodies, only hit URLs
- Detail matters for HTTP semantics
- "action + loader" functions in React Router: obscuring details around GET/POST

---

**Auth Nits: Afterword**
- Scope it in User Data Flows (see 1)
- How to handle route protection? admin pages?
- You can just come up with a solution
- Know what tool you're using and how it handles it
  - eg. BetterAuth does XYZ, where and how is it relevant? 
  - where can it be hooked in?
- CORS: no need to handle if you're running framework and server on same machine. YAY

**RECAP**
1. Core User Flow: visualise your user with the product
2. Data Models: data storage handles your questions and answers
3. Architecture Diagram: clarify your technology stack
4. API Sketch: support your functions and components

---

*Notes appear to be from a system design interview or study session focusing on building a campground reservation system with emphasis on user flows, data modeling, API design, and architecture considerations.*