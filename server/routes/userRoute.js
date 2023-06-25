const express = require("express"); 

const {createUser, getUsers, getUserById, updateUser, deleteUser} = require("../controllers/userController");

const router = express.Router(); 

router.route("/create").post(createUser)
router.route("/getuser").get(getUsers)
router.route("/getuser/:id").get(getUserById)
router.route("/updateuser/:id").put(updateUser)
router.route("/deleteuser/:id").delete(deleteUser)

module.exports = router; 

