const Utilizador = require('../models/utilizador');

exports.searchUtilizador = async (req, res, next) => {
    try {
        const { name } = req.params;
        const utilizadores = await Utilizador.find().exec();
        const userByName = utilizadores.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
        res.json(userByName);
    } catch (error) {
      console.error(`Error searching for users: ${error.message}`);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.followUser = async (req, res) => {
  try {
    const { loggedUserId, userId } = req.params;
    const loggedUser = await Utilizador.findById(loggedUserId);
    const userToFollow = await Utilizador.findById(userId);
    
    if (!loggedUser || !userToFollow) {
      return res.status(404).send({ message: 'User not found' });
    }

    loggedUser.following.push(userToFollow);
    userToFollow.followers.push(loggedUser);
    await loggedUser.save();
    await userToFollow.save();

    res.send(loggedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error following user' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { loggedUserId, userId } = req.params;
    const loggedUser = await Utilizador.findById(loggedUserId);
    const userToUnfollow = await Utilizador.findById(userId);

    if (!loggedUser || !userToUnfollow) {
      return res.status(404).send({ message: 'User not found' });
    }

    const followingIds = loggedUser.following.map((user) => user._id.toString());
    const index = followingIds.indexOf(userToUnfollow._id.toString());
    if (index >= 0) {
      loggedUser.following.splice(index, 1);
      userToUnfollow.followers.remove(loggedUser);
      await loggedUser.save();
      await userToUnfollow.save();
    }

    res.send(loggedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error unfollowing user' });
  }
};



exports.getAllUsers = async function (req, res, next){
    try {
        const users = await Utilizador.find().exec();
        res.json(users);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
}


exports.createUtilizador = function (req, res, next){
    const theUtilizador = new Utilizador(req.body);
    console.log(theUtilizador);
    
    theUtilizador.save(function(err,theUtilizador){
    res.json(theUtilizador);
})
}

exports.findUtilizador = function (req, res, next){
    const { name, password } = req.params;
    Utilizador.findOne ({name,password}).exec(function (err, utilizador) {
        res.json(utilizador);
    })
}

exports.findUtilizadorByName = function (req, res, next){
    const { name } = req.params;
    Utilizador.findOne ({name}).exec(function (err, utilizador) {
        res.json(utilizador);
    })
}

exports.findById = async function (req, res, next){
    try {
        const userId = req.params.id;
        const user = await Utilizador.findById(userId).exec();
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.status(200).json(user);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
}


exports.getFollowingList = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Utilizador.findById(userId).populate('following', 'name');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const followingList = user.following.map(({ _id, name }) => ({ _id, name }));
    res.send(followingList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting following list' });
  }
};

exports.getFollowersList = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Utilizador.findById(userId).populate('followers', 'name');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const followersList = user.followers.map(({ _id, name }) => ({ _id, name }));
    res.send(followersList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting followers list' });
  }
};

// exports.getUserList = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await Utilizador.findById(userId).select('name email');
//     if (!user) {
//       return res.status(404).send({ message: 'User not found' });
//     }
//     res.send(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error getting user' });
//   }
// };




//EDITAR PERFIL
exports.updateUsername = (req, res) => {
  const userId = req.params.userId;
  const newUsername = req.body.username;

  Utilizador.findByIdAndUpdate(userId, { name: newUsername }, { new: true })
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    });
};

exports.updateImageProfile = (req, res) => {
  const userId = req.params.userId;
  const newImageUrl = req.body.imageProfile;

  Utilizador.findByIdAndUpdate(userId, { imageProfile: newImageUrl }, { new: true })
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    });
};


// exports.getFollowersList = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const user = await Utilizador.findById(userId).populate('followers', 'name');
//     if (!user) {
//       return res.status(404).send({ message: 'User not found' });
//     }
//     const followersList = user.followers.map(({ _id, name }) => ({ _id, name }));
//     res.send(followersList);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Error getting followers list' });
//   }
// };
