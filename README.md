### Devart

#### What is this ?

It's just a program that automate downloading images from deviantart.

#### How it's work ?

by working with the official deviantart API and a little bit of tweaks.

#### Requirement

`nodejs`

#### To start ?

1. clone this repo, and run this command :
2. create .env file inside the project root and copy this code

```
CLIENT_ID=<your-client-id>
CLIENT_SECRET=<your-client-secret>
REDIRECT_URI=http://localhost:3000/callback
```

3. then create config.json inside the project root and also copy this code

```
codeLocation=C:/devart/code
downloadLocation=C:/devart/download
dbLocation=C:/devart/database
```

```
npm start
```

#### Note

my next goal is to make steps above automated because i feel like it's take too long to setup
