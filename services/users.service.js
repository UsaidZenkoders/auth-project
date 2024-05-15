const Users = {
    users: require("../model/users.json"),
    setUsers: (data) => (this.users = data),
  };
module.exports=Users