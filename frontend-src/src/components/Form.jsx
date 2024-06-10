const Form = ({onSubmit, onChangeName, valueName, onChangeNumber, valueNumber}) =>
    <>
        <h2>add a new</h2>
        <form onSubmit={onSubmit}>
            <div>
                name: <input onChange={onChangeName} value={valueName} />
            </div>
            <div>
                number: <input onChange={onChangeNumber} value={valueNumber} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    </>

export default Form