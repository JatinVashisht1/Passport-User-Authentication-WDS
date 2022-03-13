const express = require('express');
const app = express();
const port = 8080;
const bcrypt = require("bcrypt");
app.use(express.json());


// create a salt
// this salt will be used with the password to create a hashed password

const users = []

// don't make any such route in real app
// that exposes user's info and pass
app.get('/users', (req, res) => {
    res.json(users)
})


app.post('/users', async (req, res) => {

    try {
        // bcrypt can automatically generate salt for us, in hash function
        // const salt = await bcrypt.genSalt()

        // just pass the number of rounds to generate salt!
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // console.log(salt)
        console.log(hashedPassword)
        const user = { username: req.body.username, password: hashedPassword }
        console.log(user)
        users.push(user)
        res.status(201).send("user saved")
    } catch (err) {
        res.status(501).send()
        console.log(err.message)
    }

    // there is a problem with the below approach
    // the problem is that password is being stored in plain text
    // and if someone gains access to our database then they will have all pass and username!
    // therefore we will hash our usernames and passwords
    // so that if anyone ever gets to our db then also our data is secured
    // const user = {username: req.body.username, password:req.body.password}
    // console.log(user)
    // users.push(user)
    // res.status(201).send("user saved")
})

app.post('/users/login', async (req, res)=>{
    const user = users.find(user => user.username = req.body.username)
    console.log("user is ", req.body.username)
    if(user == null){
        return res.status(400).send("Cannot find user")
    }
    console.log("user is ", user)
    try{
        // make sure do the comparison with bcrypt.compare
        // because it prevents us from timing attacks
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send("Success")
        }else{
            res.send("Not allowed!")
        }

    }catch{
        return res.status(400).send("Cannot find user")
    }
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})