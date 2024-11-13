import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";

const NavBar = () => {
  const { user, logOut } = useAuth();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Log Out Successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="">
      <p className="my-4">-----------+++-----------</p>
      <button className="btn btn-outline btn-accent mx-2">
        <Link to="/secrete">Secrete</Link>
      </button>
      {user ? (
        <>
          <span>{user?.displayName}</span>
          {/* Displaying user profile image */}
          <span>
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="User Profile"
                className="w-12 h-12 rounded-full inline-block mx-2"
                referrerPolicy="no-referrer" // To prevent issues with third-party images
              />
            )}
          </span>
          <button
            onClick={handleLogOut}
            className="btn btn-outline btn-accent mx-2"
          >
            LogOut
          </button>
        </>
      ) : (
        <>
          <button className="btn btn-outline btn-accent mx-2">
            <Link to="/login">Login</Link>
          </button>
          <button className="btn btn-outline btn-accent mx-2">
            <Link to="/signup">SignUp</Link>
          </button>
        </>
      )}
      <p className="my-4">-----------+++-----------</p>
    </div>
  );
};

export default NavBar;
