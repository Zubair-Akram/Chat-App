const UserListItem = ({ user, handleFunction }) => {
  return (
    <div className="user-list-item" onClick={() => handleFunction(user._id)}>
      <img src={user.pic} alt={user.name} className="user-avatar" />
      <div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
