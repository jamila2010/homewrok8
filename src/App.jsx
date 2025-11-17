import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { db } from "./firebase/config";
import { MdModeEdit } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";

function App() {
  const q = query(collection(db, "userlist"), orderBy("createdAt", "desc"));
  const [data, setData] = useState([]);
  const [todo, setTodo] = useState("");
  const [doneList, setDoneList] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleEdit = (id, name) => {
    console.log(id);
    setEditId(id);
    setTodo(name);
  };

  const toggleDone = (id) => {
    setDoneList((prev) =>
      prev.includes(id)
        ? prev.filter((todo) => {
            return todo !== id;
          })
        : [...prev, id]
    );
  };

  // Get data from firebase

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const washingtonRef = doc(db, "userlist", editId);
      updateDoc(washingtonRef, {
        name: todo,
      })
        .then((res) => {
          toast.success("Updated successfully");
          setEditId(null)
        })
        .catch((err) => {
          toast.errror(err.meassage);
        });

      return;
    }

    if (!todo.length) {
      toast.error("Cannot create empty todo.");
    }

    addDoc(collection(db, "userlist"), {
      name: todo,
      createdAt: new Date(),
    })
      .then(() => {
        toast.success(`New todo added!`);
        setTodo("");
      })
      .catch((err) => console.log(err.message));

    e.target.reset();
  };

  const handleDelete = (id) => {
    deleteDoc(doc(db, "userlist", id))
      .then(() => {
        toast.success("Deleted successffuly.", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
          },
          iconTheme: {
            primary: "#713200",
            secondary: "#FFFAEE",
          },
        });
      })
      .catch((err) => {
        toast.error("Error");
      });
  };

  useEffect(() => {
    const usersData = onSnapshot(q, (usersData) => {
      const users = usersData.docs.map((user) => {
        return { id: user.id, ...user.data() };
      });
      setData(users);
    });
  }, []);

  useEffect(() => {
    if (!editId) {
      setTodo("");
    }
  }, [editId]);

  return (
    <div className="bg-slate-200 p-30 m-0 flex flex-col items-center justify-center min-h-screen cursor-pointer">
      <ul className="bg-white rounded-xl p-10 text-[25px] w-full flex flex-col gap-2 ">
        <li className="border-b font-medium text-[26px] ">
          {data.length
            ? "Todos:"
            : "No current tasks available, want to add one?"}{" "}
        </li>
        {data &&
          data.map(({ id, name, number, age }) => {
            const isEditingId = editId === id;
            return (
              <li
                key={id}
                className={`shadow rounded p-2 flex justify-between ${
                  doneList.includes(id) ? " bg-gray-100" : ""
                }`}
              >
                <div className={`${ doneList.includes(id) ? "line-through"  : " " }`}>
                  {name} <span>{age}</span>
                </div>
                <div className="flex gap-[11px] ">
                  <button
                    className={`rounded-lg border-none px-2 py-[3px] ${
                      doneList.includes(id)
                        ? "bg-gray-200 "
                        : "bg-lime-200 hover:bg-lime-300"
                    } cursor-pointer `}
                    onClick={() => toggleDone(id)}
                  >
                    {doneList.includes(id) ? "Done" : "Waiting"}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(id);
                    }}
                    className=" cursor-pointer"
                  >
                    <FaTrashAlt className="hover:shadow-[0_0_10px_#fca5a5] bg-[0_0_10px_#fca5a5]" />
                  </button>
                  {isEditingId ? (
                    <button
                      className="cursor-pointer"
                      onClick={() => {
                        setEditId(false);
                      }}
                    >
                      <MdOutlineCancel />
                    </button>
                  ) : (
                    <button
                      className="cursor-pointer  "
                      onClick={() => {
                        handleEdit(id, name);
                      }}
                    >
                      <MdModeEdit className="hover" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
      <form
        className="flex items-center gap-[15px] mt-4 "
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label>
          <input
            onChange={(e) => {
              setTodo(e.target.value);
            }}
            type="text"
            placeholder="To do"
            className="bg-white outline-none rounded-lg px-2 py-1 w-[400px] h-[35px] text-[18px] "
            value={todo}
          />
        </label>
        {editId ? (
          <button
            className="bg-slate-50 text-[18px] w-[200px] rounded-lg cursor-pointer hover:scale-90 h-[33px] "
            name="todo"
            id="todo"
          >
            Save
          </button>
        ) : (
          <button
            className="bg-slate-50 text-[18px] w-[200px] rounded-lg cursor-pointer hover:scale-90 h-[33px] "
            name="todo"
            id="todo"
          >
            Create
          </button>
        )}
      </form>
    </div>
  );
}

export default App;
