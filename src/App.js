import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";

function App() {
  const getQuery = gql`
    query MyQuery {
      test {
        name
        id
      }
    }
  `;

  const add_Data = gql`
    mutation MyMutation($name: String) {
      insert_test(objects: { name: $name }) {
        returning {
          name
        }
      }
    }
  `;
  const delete_Data = gql`
    mutation MyMutation($id: uuid) {
      delete_test(where: { id: { _eq: $id } }) {
        returning {
          id
          name
        }
      }
    }
  `;

  const update_data = gql`
    mutation MyMutation($idholder: uuid, $edit: String) {
      update_test(where: { id: { _eq: $idholder } }, _set: { name: $edit }) {
        returning {
          id
          name
        }
      }
    }
  `;

  const { loading, data } = useQuery(getQuery);
  const [name, setname] = useState("");
  const [addData, { error }] = useMutation(add_Data);
  const [deleteData] = useMutation(delete_Data);
  const [edit, setedit] = useState("");
  const [idholder, setIdholder] = useState(0);
  const [modal, setModal] = useState(false);
  const [updateData] = useMutation(update_data);

  const handlesubmit = (e) => {
    e.preventDefault();
    addData({ variables: { name: name } });
  };

  const delName = (id) => {
    deleteData({ variables: { id } });
  };

  const openmodal = (id) => {
    setIdholder(id);
    setModal(true);
  };

  const handleedit = (e) => {
    e.preventDefault();
    updateData({ variables: { idholder, edit } });
  };

  return (
    <div className="App">
      <button
        onClick={() => {
          console.log(data);
        }}>
        llada
      </button>

      <form action="submit" onSubmit={handlesubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
        />
      </form>

      {modal && (
        <form action="submit" onSubmit={handleedit}>
          <input
            type="text"
            value={edit}
            onChange={(e) => {
              setedit(e.target.value);
            }}
          />
        </form>
      )}

      {loading ? (
        <h1>LOADING.......</h1>
      ) : (
        data.test.map((e) => (
          <div key={e.id}>
            {e.name}{" "}
            <button
              onClick={() => {
                delName(e.id);
              }}>
              delete
            </button>
            <button
              onClick={() => {
                openmodal(e.id);
              }}>
              edit
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
