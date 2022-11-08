


#### Setup basic express server.
- [x] import express
- [x] setup port

#### Setup Mongo DB connection.
- [x] import mongoose
- [x] invoke mongoose.connect function argument with url and export it
- [x] declare MONGO_URL variable in .env
- [x] import dotenv and config
- [x] import connection function 
- [x] setup connection before app listen

#### Setup basic Routes and Middleware
- [x] basic route '/'
- [x] setup express.json() middleware
- [x] create a middleware for "NotFound" ,"errorHandler"
- [x] import express-async-errors.

### notFound vs errorHandler middleware
- notFound just like a req,res callback
- if where not any callback invoked to request
- automatically middleware invoke that notFound callback

- errorHandler middleware
- this middleware contains four arguments ,first one is err object
- this middleware invoked itself when error emitted throw  Error object

#### morgan - package
- [x] used for log requests

#### User Model
- [x] import mongoose
- [x] destructure Schema.model
- [x] init Schema object with name,email,password,roll
- [x] use - validator package

#### Auth routes structure.
- [x] create controller folder
- [x] create authController file
- [x] create and export register,login, and logout controllers
- [x] create routes folder
- [x] create authRoutes file
- [x] import express and invoke Router() to router  variable
- [x] import controller from authController - register,login,logout
- [x] set routes via chaining through router as mentioned above post-login,register | get - logout
- [x] exports router
- [x] set up base router

#### post man setup

#### Basic Register setup
- [x] bad request for already registered users
- [x] first user as admin
- [x] create user in db
- [x] import bcrypt
- [x] pre - to hash the password
- [x] compare password.

#### JWT with cookies
- [x] create util as a jwt token and verify functions
- [x] refactor on existing code
- [x] make utils as token response with cookies

#### signed and secure flag
- [x] pass "secure":boolean and "signed": boolean in cookies method
- [x] provide "JWT_SECRET" to cookie parser middleware where it invoked
- [x] now we can access cookies from 'signedCookies' methods

#### login route
- [x] get email,password from body.
- [x] check value fields
- [x] then email check email existence
- [x] compare password
- [x] send token cookies
- [x] send response

#### logout route
- [x] set "token" cookie value some string
- [x] set "expire" cookie value in a secs

#### cors in front end
- [x] we should request api in same domain
- [x] it makes cors error
- [x] we can use cors package
- [x] even we don't get cookie 
- [x] we can use "proxy" and send domain as value
- [x] this makes every request from that domain
- [x] ?

#### user routes and controllers
- [x] add userController file in controller folder
- [x] create (getAllUsers, getSingleUser,getCurrentUser, updateSingleUser,     updateUserPassword)
- [x] create routes ('api/v1/users')-base
- [x] create router

#### postman setup users routes
- [x] setup

#### getAllUsers and getSingleUser 
- [x] getAllUsers
- [x] import User model
- [x] User.find({})
- [x] send response

- [x] get id from req.params
- [x] get single user
- [x] User.findOne({id}).select('-password')
- [x] if user not exist with id
- [x] throw error msg with "no user id of {that id}"
- [x] send response

#### user authentication
- [x] create a middleware for user authentication
- [x] set middleware before user route
- [x] get token from signed cookies
- [x] set no token error
- [x] verify jwt
- [x] invoke next()

#### authorize permission
- [x] + reusable authorizePermission()

#### authorize permission complete
- [x] + invoke authorizePermission()
- [x] + if(!roles.includes(roles))

#### get me route
- [x] + send json with direct req.user

#### update password route
- [x] new* model.save()
- [x] + condition to check new and old fields
- [x] + compare
- [x] + model.password = newPassword
- [x] + model.save()
- [x] +send response

#### update user route - authenticate user.
- [x] get the id
- [x] findOneAndUpdate({...})
- [x] jwt 
- [x] response

- [x] update the user route with Model.save()
- [x] tangled pre method invoking with this.modifiedPaths()

#### get single user route with admin and same user
- [x] + checkPermissions()
- [x] + check whether request user is admin or request id params themselves else throw the error.


#### product Model

#### product 
- [x]  + functions (createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct, uploadImage)
- [x] + base route (/api/v1/products)
- [x] +set routes with authenticateUser, userPermissions , routeName


### create product
- [] get userID from req.user
- [] create "user" key in req.body
- [] create new item in Products model.

#### product's other router

#### image upload