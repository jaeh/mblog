micro-blog
==

a self hosted microblogging service similar to soup.io or tumblr

will allow:

downloading all images and videos to your server,

converting videos into html5 video formats (if wanted, if not flowplayer will be used to display videos (needing flash in return))

cross domain reblogging, liking, friending

client side should work without javascript or flash if user enables the right options ;)

to replicate:

    git clone https://github.com/jaeh/mblog.git
    
    npm install 
    
    to test: npm run testenv
    
    to deploy: forever start -l forever.log -o out.log -e err.log app.js
    
    //server will be running on port 2323 now.
