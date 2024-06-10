const Notification = ({notification}) => {
    const common_style = {
        background: "lightgrey",
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        fontSize: 20,
    }

    const success_style = {
        ...common_style,
        color: "green"
    }

    const error_style = {
        ...common_style,
        color: "red"
    }


    if (notification.message === "") {
        return null
    }

    if (notification.isError) {
        return (
            <div style={error_style}>
                {notification.message}
            </div>
        )
    }
    else {
        return (
            <div style={success_style}>
                {notification.message}
            </div>
        )
    }
}

export default Notification