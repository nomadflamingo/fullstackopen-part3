const Numbers = ({persons, onDelete}) =>
    <>
        <h2>Numbers</h2>
        <div>
            {persons.map(p => 
                <p key={p.id}>{p.name} {p.number}
                <button onClick={onDelete(p.id)}>delete</button>
                </p>)}  
        </div>    
    </>

export default Numbers