const Header = (props) => {
    console.log(props)
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Part = (props) => {
    console.log(props)
    return (
        <div>
            <p>{props.name} {props.exercises}</p>
        </div>
    )
}

const Content = (props) => {
    console.log(props)
    return (
        <div>
            {props.parts.map(part =>
                <Part key={part.id} name={part.name} exercises={part.exercises} />
            )}
        </div>
    )
}

const Total = (props) => {
    console.log(props)
    const total = props.parts.reduce((huh, part) => {
        console.log('test', huh, part)
        return huh + part.exercises
    }, 0)

    return (
        <div>
            <p>Number of exercises {total}</p>
        </div>
    )
}

const Course = (props) => {
    console.log(props)
    return (
        <div>
            <Header course={props.course.name} />
            <Content parts={props.course.parts} />
            <Total parts={props.course.parts} />
        </div>
    )
}

export default Course