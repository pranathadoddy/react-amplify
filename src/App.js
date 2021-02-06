import { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import { createNote, deleteNote } from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

const initialState={id: "", note: ""}
function App() {

  const [notes, setNotes] = useState([])
  const [note, setNote] = useState(initialState)

  const handleChangeNote = event => setNote(event.target.value) ;

  useEffect(() => {
   getNotes();
  }, []);

  async function getNotes(){
    const result = await API.graphql(graphqlOperation(listNotes))
    const data = result.data.listNotes.items
    setNotes(data)
  }

  async function handleAddNote(event){
    try {
      event.preventDefault();

      const input ={ note };
      const result = await API.graphql(graphqlOperation(createNote, { input }))
      const newNote = result.data.createNote;

      setNotes(currentNotes => [...currentNotes, newNote]);
      setNote(initialState);
     
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  async function handleDeleteNote(noteId){
    try{

      const input = {id: noteId}
      const result = await API.graphql(graphqlOperation(deleteNote, { input }))
      const deletedNoteId = result.data.deleteNote.id;
      const updatedNotes = notes.filter(item=> item.id !== deletedNoteId)
      setNotes(updatedNotes)
      
    }catch(err){
      console.log('error creating todo:', err)
    }
  }


  return (
    <div className="flex 
    flex-column items-center 
    justify-center 
    pa3 bg-washed-red">
      <h1 className="code f2-1">
        Amplify Notetaker
     </h1>
      {
        <form className="mb3" onSubmit={handleAddNote}>
          <input type="text"
            className="pa2 f4"
            placeholder="Write Your Note"
            onChange={handleChangeNote} 
            value={note.note}/>
          <button
            className="pa2 f4"
            type="submit"
          >
            Add Note
          </button>

        </form>
      }
      {
        notes.map((item, index) => (
          <div key={index} className="flex itemCenter">
            <li className="list pa1 f3">
              {item.note}
            </li>
            <button className="bg-transparent bn f4" onClick={() => handleDeleteNote(item.id)}>&times;</button>
          </div>
        ))
      }
      <div>

      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
