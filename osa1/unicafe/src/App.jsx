import { useState } from 'react'

const Button  = (props) => {
  return (
    <input type='button' onClick={() => props.set(props.number + 1)} value={props.text}/>
  )
}

const StatisticsLine = (props) => {
  if (props.text === 'positive') {
    return (
      <tr>
        <th>{props.text}</th>
        <th>{props.number}</th>
        <th>%</th>
      </tr>
    )
 
}
return (
  <tr>
  <th>{props.text}</th>
  <th>{props.number}</th>
</tr>
 )
}
const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad;
  const average = (props.good - props.bad) / all;
  const positive = props.good / all * 100;
if (all=== 0) {
  return <p>No feedback given</p>
} else return (
  <div>
  <table>
    <StatisticsLine text='good' number={props.good}/>
    <StatisticsLine text='neutral' number={props.neutral}/>
    <StatisticsLine text='bad' number={props.bad}/>
    <StatisticsLine text='all' number={all}/>
    <StatisticsLine text='average' number={average}/>
    <StatisticsLine text='positive' number={positive}/>
  </table>
</div>
  )
}

const App = () => {
 
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>

      <Button set={setGood} number={good} text='good'/>
      <Button set={setNeutral} number={neutral} text='neutral'/>
      <Button set={setBad} number={bad} text='bad'/>

        <h1>Statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App

