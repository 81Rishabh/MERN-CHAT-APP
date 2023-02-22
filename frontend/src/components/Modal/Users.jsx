import { useSelector } from "react-redux";
import Avatar from "../Avatar/Avatar";

function Users(props) {
  const { data } = useSelector((state) => state.User);

  // handle select users
  const handleSelectUser = (event , USER_ID) => {
      const isChecked = event.target.checked;
      props.setusers(prev => {
         if(isChecked) {
            prev = [...prev , USER_ID];
         } else {
            prev = prev.filter(user => user !== USER_ID);
         }
         return prev;
      })
  }

  return (
    <div
      className="Users"
      style={{
        height: props.showUsers ? "200px" : "0px",
        position: "relative",
      }}
    >
      <ul>
        {data &&
          data.map((user) => (
            <li className="users__items" key={user._id}>
              <div className="users__items__left">
                <Avatar w="25" h="25" imgURL={user.profile_img} />
                <p className="username">{user.username}</p>
              </div>
              <div className="user__item__right checkboxes">
                <input
                  type="checkbox"
                  name="user"
                  onChange={(e) => handleSelectUser(e,user._id)}
                />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Users;
