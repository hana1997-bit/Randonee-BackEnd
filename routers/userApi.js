const express = require('express');
const router = express.Router();

const userController = require('../Controllers/userController');
// const { getMaxListeners } = require('process');

// get all user
router.get('/users', userController.get)

//get user by id
// router.get('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "no one have this id" })
//   }
// });

// creat all user
router.post('/singup', userController.create)
// singin user
router.post('/singin', userController.login);

//update user
router.put('/users/:id', userController.update);



//delete user
router.delete('/users/:id', userController.delete);
// affect agent to  user 
router.put("/agentUser/:iduser/:idagent", userController.put);
// desaffecte agent to user
router.put("/desaagentUser/:iduser/:idagent", userController.put);





module.exports = router;