const express = require('express');
const router = express.Router();
const agentController= require('../Controllers/agenceController');
// get all agents
router.get('/agents',agentController.get);

//get agent by id
// router.get('/agents/:id', async (req, res) => {
//     try {
//         const agent = await Agent.findById(req.params.id);
//         res.json(agent);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "no one have this id" })
//     }
// });

// creat events
router.post('/creation',agentController.post );
//update Agent
router.put('/agents/:id',agentController.put);



//delete agent
router.delete('/agents/:id',agentController.delete);

// affect reserve to  agent
router.put("/agentreserve/:idagent/:idreserve",agentController.put);
  // desaffecte reserve to agent
  router.put("/desaagentreserve/:idreserve/:idagent",agentController.put);
  



module.exports = router;