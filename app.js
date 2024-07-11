import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

const posts = [];
const users = [{ username: 'admin', password: 'password' }];

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new-post');
});

app.post('/new', requireAuth, (req, res) => {
    const post = {
        title: req.body.title,
        content: req.body.content,
        date: new Date().toLocaleString()
    };
    posts.push(post);
    res.redirect('/');
});

app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];
    res.render('post', { post, postId });
});

app.get('/edit/:id', requireAuth, (req, res) => {
    const postId = req.params.id;
    const post = posts[postId];
    res.render('edit-post', { post, postId });
});

app.post('/edit/:id', requireAuth, (req, res) => {
    const postId = req.params.id;
    posts[postId].title = req.body.title;
    posts[postId].content = req.body.content;
    res.redirect('/');
});

app.post('/delete/:id', requireAuth, (req, res) => {
    const postId = req.params.id;
    posts.splice(postId, 1);
    res.redirect('/');
});


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

function requireAuth(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.listen(port, () => {
    console.log('Server is running on port 3000');
});