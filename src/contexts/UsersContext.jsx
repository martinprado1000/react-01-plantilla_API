import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./AuthUserContext";
const URL_BACK = import.meta.env.VITE_URL_BACK;

const UsersContext = createContext();

// Este es nuestro hook que exporta el contexto
export function useUsersContext() {
  return useContext(UsersContext);
}

// Provider
export function UsersProvider({ children }) {

  const { userAuth } = useAuthContext();
 
  const [users, setUsers] = useState(false);
  
  const getUsers = async () => {
    const res = await actionUser("get");
    setUsers(res);
    return
  };

  const actionUser = async (action, data, id) => {
    
    let res;

    try {
      switch (action) {

        case "get": {
          res = await fetch(`${URL_BACK}/api/users/?limit=100`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          break;
        }

        case "getByTerm": {
          res = await fetch(`${URL_BACK}/api/users/${id}`, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          break;
        }

        case "add": {
          res = await fetch(`${URL_BACK}/api/users`, {
            method: "POST",
            //credentials: "include", // Permito que el backend cargue y elimine las cookie en el front
            headers: {
              Authorization: `Bearer ${userAuth.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          break;
        }

        case "edit": {
          res = await fetch(`${URL_BACK}/api/users/${id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${userAuth.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          break;
        }

        case "delete": {
            res = await fetch(`${URL_BACK}/api/users/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${userAuth.token}`,
                "Content-Type": "application/json",
              },
            });
            if (res.status===204) return
          }
          break;

          case "recoveryPassword": {
            res = await fetch(`${URL_BACK}/api/recoveryPassword`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data)
            });
            if (res.status===204) return
          }
          break;

      }

      const responsBackend = await res.json();

      if (res.status == 401) {
        // Si no esta autorizado elimino la cookie
        console.log(responsBackend.message);
        sessionStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        return responsBackend;
      }
    } catch (error) {
      console.log(error);
      window.location.href = "/fatalErrorPage";
    }
  };

  return (
    <UsersContext.Provider
      value={{ getUsers, users, setUsers, actionUser }}
    >
      {children}
    </UsersContext.Provider>
  );
}
