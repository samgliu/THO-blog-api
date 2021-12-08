# Blog API server

# Description

A blog API server side build for TOP project.

Server:  
Client:  
CMS:

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

/_ Index _/

get('/'); // get index page same as below

get('/posts'); // GET posts home page.

/_ User _/

post('/signup'); // user sign up with (firstname, lastname, email, username, password, confirm) field

post('/signin'); // user sign in with username: password

put('/upgrade-admin'); // upgrade to admin with admin password: admin

get('/logout'); // user log out

/_ Post _/

post('/create-post'); // create new post with(topic, content) field

get('/:id'); // get a single post with all field including array of comments; :id is post id

put('/:id'); // edit a post with new (topic, content) field; :id is post id

delete('/:id/delete'); // delete a post and its comments

/_ Comment _/

// create new comment with (name, content) field, no login required, :id is post id
post('/:id/comment-create');

// delete an comment, admin login required, :id is post id, :cid is comment id
delete('/:id/comment/:cid/delete');
