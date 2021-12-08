# Blog API server

# Description

A blog API server side build for TOP project.

Server repository:https://github.com/samgliu/THO-blog-api  
Server API Demo:https://morning-dawn-19775.herokuapp.com/

Client repository:https://github.com/samgliu/THO-blog-api-client  
Client Demo:https://samgliu.github.io/THO-blog-api-client/

# Built With

-   Node.js
-   Express
-   passportJS
-   ejs

# Feature:

Create User  
Log in/out  
Auth  
Post  
Comment  
Server/Client/CMS
RESTful

# API Usage:

const corsConfig = {
...
origin: 'http://localhost:3000', // must be set to the domain client side usage
};

/_ Index _/

get('/'); // get index page same as below

get('/posts'); // GET posts home page.

/_ User _/

post('/signup'); // user sign up with (firstname, lastname, email, username, password, confirm) field

post('/signin'); // user sign in with username: password

put('/upgrade-admin'); // upgrade to admin with admin password: admin; return user

get('/logout'); // user log out

/_ Post _/

post('/create-post'); // create new post with(topic, content) field

get('/:id'); // get a single post with all field including array of comments; :id is post id

put('/:id'); // edit a post with new (topic, content) field; :id is post id

delete('/:id/delete'); // delete a post and its comments

/_ Comment _/

// create new comment with (name, content) field, no login required, :id is post id ;  
// return the new post
post('/:id/comment-create');

// delete an comment, admin login required, :id is post id, :cid is comment id
delete('/:id/comment/:cid/delete');
