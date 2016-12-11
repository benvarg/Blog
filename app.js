var blogPosts = {
  "my-first-webpage": {
    "title": "My first webpage",
    "excerpt": "I've taken a course at Code at Uni and created my own personal website with HTML and CSS.",
    "content": "\
    <p>My first paragraph as well!</p>\
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula ante nec neque lobortis, fringilla convallis elit dignissim.</p>\
    "
  },
  "hello-world": {
    "title": "Hello World",
    "excerpt": "This is the start of my online journal. I will take about my journey in learning how to code!",
    "content": "\
    <p>Hello World this is a paragraph.</p>\
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vehicula ante nec neque lobortis, fringilla convallis elit dignissim.</p>\
    "
  },
};

var express = require('express');
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var mailgun = require('mailgun-js')({
  apiKey: 'key-56a7bf13d8ed6a152a99c865511858bf', domain: 'sandbox110755d9889f4998af1d0aafd5911d13.mailgun.org'
});

var app = express();


app.engine('.hbs',exphbs({extname: ".hbs"}));
app.set('view engine','.hbs')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

//homepage
app.get("/", function(request,response){
  response.render("home");
});

//contact
app.get("/contact", function(request, response){
  response.render("contact.hbs");
});

//about
app.get("/about", function (request, response){
  response.send("ALL about me :P")
});

//Listening
app.listen(5000, function(){
  "I'm listening on port 5000, don't shout..";
})

//blog cos I'm cool
// Blog
app.get('/blog', function(req, res) {
  // Create a list of blog posts from our blogPosts object
  // We're doing this because we need to format our data
  // in a way that's usable in our templates
  var listOfPosts = [];
  Object.keys(blogPosts).forEach(function(postId) {
    var post = blogPosts[postId];
    post.id = postId;
    listOfPosts.push(post);
  });

  // Render blog.handlebars with the data it needs
  res.render('blog', {
    posts: listOfPosts,
  });
});

// A single blog post
app.get('/blog/:post_id', function(req, res) {
  // Extract the id from the url entered
  var postId = req.params['post_id'];

  // Find the post
  var post = blogPosts[postId];

  // Show a 404 page if the post does not exist
  if (!post) {
    res.send('Not found');
  } else {
    // Render post.handlebars with the data it needs
    res.render('post', post);
  }
});

// Handle the contact form submission
app.post('/contact', function(req, res) {
  var formBody = {
    'name': req.body.name,
    'email': req.body.email,
    'subject': req.body.subject,
    'message': req.body.message,
  };

  console.log(formBody);

  // res.render('contact.hbs', {
  //   formBody,
  // });
  
  var missingName = (formBody.name === '');
  var missingEmail = (formBody.email === '');
  var missingMessage = (formBody.message === '');

  if(missingName || missingEmail || missingMessage) {
    res.render('contact.hbs', {
      error: true,
      message: 'Some fields are missing.',
      formBody: formBody,
      missingName: missingName,
      missingEmail: missingEmail,
      missingMessage: missingMessage,
  });
}else {
// Email options
var emailOptions = {
  from: formBody.name + ' <' + formBody.email + '>',
  to: 'benvarghese@hotmail.co.uk',
  subject: 'Website contact form - ' + formBody.subject,
  text: formBody.message,
};

// Try send the email
mailgun.messages().send(emailOptions, function (error, response) {
  if (error) {
    res.render('contact', {
      error: true,
      message: 'The message was not sent. Please try again.',
      formBody: formBody,
    });
  } else {
    res.render('contact', {
      success: true,
      message: 'Your message has been successfully sent!',
    });
  }
  });
}
});

