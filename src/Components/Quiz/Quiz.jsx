import React, { useRef, useState } from "react";//usestate to manage state, useref to directly access and modify DOM elements
import "./Quiz.css";
import { data } from "../../assets/data";

document.cookie = "username = John Doe"; // Set cookie
const Quiz = () => {
  const [index, setIndex] = useState(0);//to track the current question index
  const [lock, setLock] = useState(false);//to prevent multiple check for same ques
  const [score, setScore] = useState(0);//how many correct answers
  const [result, setResult] = useState(false);//to determine if quiz is completed if true then show score

//references for each question option to manipulate their classes based on user interaction
  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);

  let option_array = [Option1, Option2, Option3, Option4];//provide option elements in the form for choosing correct answer 

  const question = data[index]; // current question object based on the current index state

  //function to check if selected answer is correct or not

  const checkAns = (e, ans) => { //two parameters event object and selected answer where e is used to access the clicked option element and ans is the selected answer
    if (!lock) { //only allow answering if question is not locked i.e. if question has not been answered then allow answering

      if (question.ans === ans) {//if selected answer matches the correct answer for the current question
        e.target.classList.add("correct");//classlist property added to change anything if needed in css which is invoked when the answer is correct and e.target refers to the clicked option element
        setScore((prev) => prev + 1);//increase score by 1 using previous state
      } else {
        e.target.classList.add("wrong");//if answer is wrong add wrong class to clicked option element
        option_array[question.ans - 1].current.classList.add("correct");//here question.ans-1 is used to get the index of the correct option in the option_array and add correct class to it is added  to highlight the correct answer
      }
      setLock(true);//in this case lock is set  true to prevent any changes to the answer for the current question
    }
  };

  const next = () => {//this function is invoked when user clicks on next button to move to next question
    if (lock) {  //only allow moving to next question if current question is locked i.e. if it has been answered
      if (index === data.length - 1) { //if current index is equal to the last index of the data array then it means all questions have been answered
        setResult(true);//true is set to indicate the function is completed and score displayed
        return; //stop the function
      } 
   
      const nextIndex = index + 1;//if the index is not the last index then increment the index by 1 to move to next question
      setIndex(nextIndex);
      setLock(false);//lock is set false so that user can answer the next question

      option_array.forEach((option) => { //for every option in the option_array this function is invoked to remove the previously selected classes i.e. the answered option and the correct option for the previous question and the options are reset to their original one
        option.current.classList.remove("wrong"); //removes wrong class if it was added
        option.current.classList.remove("correct");//removes correct class if it was added
      });
    }
  };

  const reset = () => {//this function to be invoked when user clicks on reset and the quiz restarts from the beginning
    setIndex(0);//index set to 0 to start from first question
    setScore(0);//score to 0
    setLock(false);//lock to false to allow answering
    setResult(false);//result to false so that score is not displayed 

  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {!result ? (   //if result is false then show the questions otherwise show score by the use of ternary operator
        <>
          <h2>
            {index + 1}. {question.question} {/*if result is false then display current question number and text*/}
          </h2>
          {/*each li is ref and onclick handler to check the answer*/}
          <ul>
            <li ref={Option1} onClick={(e) => checkAns(e, 1)}>
              {question.option1}
            </li>
            <li ref={Option2} onClick={(e) => checkAns(e, 2)}>
              {question.option2}
            </li>
            <li ref={Option3} onClick={(e) => checkAns(e, 3)}>
              {question.option3}
            </li>
            <li ref={Option4} onClick={(e) => checkAns(e, 4)}>
              {question.option4}
            </li>
          </ul>
          <button onClick={next}>Next</button>{/*to go to next question*/}
          <div className="index">
            {index + 1} of {data.length} question {/*to show current question number out of total questions*/}
          </div>
        </>
      ) : (  
        <>
          <h2>
            You Scored {score} out of {data.length}
          </h2>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Quiz;
