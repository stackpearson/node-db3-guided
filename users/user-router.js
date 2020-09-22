const express = require("express");

const db = require("../data/db-config.js");
const Users = require('./users-model.js');
//this is pulled in from the users-model we created

const router = express.Router();

router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get users" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Users.findById(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Could not find user with given id." });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to get user" });
    });
});

router.get('/:id/posts', (req, res) => {
  const {id} = req.params;

  // const sql = db('posts as p')

  // db('posts as p')
  //   .join('users as u', 'u.id', 'p.user_id')
  //   .select('p.id', 'u.username', 'p.contents')
  //   .where({user_id:id})

  Users.findPosts(id)
    .then(posts => {
      res.json(posts)
    })
    .catch(err => {
      res.status(500).json({message: 'error getting posts'})
    })
})

router.post("/", (req, res) => {
  const userData = req.body;

  // db("users")
  //   .insert(userData, "id")
  //   .then(ids => {
  //     res.status(201).json({ created: ids[0] });
  //   })
  //   .catch(err => {
  //     res.status(500).json({ message: "Failed to create new user" });
  //   });

  Users.add(userData)
    .then(ids => {
      res.status(201).json({created: ids[0] });
    })
    .catch(err => {
      res.status(500).json({message: 'failed to create user'})
    })
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  // db("users")
  //   .where({ id })
  //   .update(changes)
  //   .then(count => {
  //     if (count) {
  //       res.json({ update: count });
  //     } else {
  //       res.status(404).json({ message: "Could not find user with given id" });
  //     }
  //   })
  Users.update(id, changes)
    .then(count => {
      if (count) {
        res.json({update: count});
      } else {
        res.status(404).json({message: "could not find user with given id"})
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to update user" });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // db("users")
  //   .where({ id })
  //   .del()
  Users.remove(id)
    .then(count => {
      if (count) {
        res.json({ removed: count });
      } else {
        res.status(404).json({ message: "Could not find user with given id" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to delete user" });
    });
});

module.exports = router;
