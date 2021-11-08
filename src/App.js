import React, { useState, useEffect } from 'react'
import './App.css';
import axios from "axios";
/**
 * TodoList
 * @returns 
 */
function App() {

  const baseUrl = "http://localhost:8080"

  const [todos, setTodos] = useState([]); //객체라는 것을 알려주기 위해서 빈 배열
  const [input, setInput] = useState(""); //초기값 ""
  

  /**
   *  useEffect에 ,[]을 사용할 경우 페이지를 로딩할 때 한번만 실행.
   */
  useEffect(() => {
    getTodos();
  }, [])

  /**
   * async function : 비동기 통신을 하는 함수
   * await 데이터를 받아올 때까지 기다린다.(비동기 async:false)
   * .get() : get 메소드 호출
   * then : 무엇을 할 것인지    success:
   * catch : 실패 시          error: 
   * 
   * 
   * CORS (교차 출처 리소스 공유 정책)
   * 리액트 앱이 스프링부트 프로젝트로 접근못함.
   * 리액트 앱은 로컬호스트3000을 가지고 있고, 
   * 스프링 프로젝트는 로컬호스트8080인데, 기본적으로 포트만 달라도 출처가 다르다고 판단하고 정책에서 튕겨냄
   * 
   * react에서 proxy를 이용해서 접근 가능하도록 하는 방법이 있다. 하지만 로컬에서만 가능한 방법.
   * package.json에 추가 
   * 혹은 Spring Boot에 WebMvcConfigurer에 설정 
   */
  async function getTodos(){
    await axios
      .get(baseUrl + "/todo")
      .then((response) =>{
        setTodos(response.data);
      })
      .catch((error) =>{
        console.log(error)
      })
  }

  /**
   * preventDefault를 넣는 이유는 onSubmit이 되면
   * 화면이 새로고침되는데 이를 막아줌.
   * 함수마다 넣어주는 것이 좋다. 
   */
  function insertTodo(e){
    e.preventDefault();

    const insertTodo = async() =>{
      await axios
            .post(baseUrl + "/todo", {
              todoName : input
            })
            .then((response) => {
              console.log(response.data);
              setInput("");
              getTodos();
            })
            .catch((error) =>{
              console.log(error);
            })
    }
    insertTodo();
    console.log("할일이 추가됨.");
  }

  function updateTodo(id){
    const updateTodo = async() =>{
      await axios
            .put(baseUrl + "/todo/" + id)
            .then((response) => {
              console.log(response.data);
              //getTodos(); db를 다시조회함으로써 reload하는 방법
              setTodos(
                todos.map((todo) => 
                  todo.id === id ? { ...todo, completed: !todo.completed } : todo
                )
              );
              //DB에 들릴 필요없이 화면만 바꾼다.
            })
            .catch((error) =>{
              console.log(error);
            })
    }
    updateTodo();
    console.log("할일이 추가됨.");
  }


  function deleteTodo(id){
    const deleteTodo = async() =>{
      await axios
            .delete(baseUrl + "/todo/" + id)
            .then((response) => {
              setTodos(
                todos.filter((todo) => todo.id !== id //todo.id가 id와 같이 않은 것만 남게됌.
                )
              );
              //DB에 들릴 필요없이 화면만 바꾼다.
            })
            .catch((error) =>{
              console.log(error);
            })
    }
    deleteTodo();
  }


  /**
   * 
   * 값이 바뀌었을 때, 다른 이벤트는 막고 setInput을 통해서 입력된 값으로 바꾸겠다. 
   */
  function changeText(e){
    e.preventDefault(); 
    setInput(e.target.value);
  }



  return (
    <div className="App">
      <h1>TODO LIST</h1>
      <form onSubmit={insertTodo}>
        <label>
          Todo &nbsp;
          <input type="text" required={true} value={input} onChange={changeText} />
        </label>
        <input type="submit" value="Create" />
      </form>

      {
        todos 
        ? todos.map((todo) => {
          return (
            <div className="todo" key={todo.id}>
              <h3>
                <label
                  className = {todo.completed ? "completed" : null}
                  onClick={() => updateTodo(todo.id)}>
                  {todo.todoName}
                </label>
                <label onClick={() => deleteTodo(todo.id)}>x</label>
              </h3>
            </div>
          )
        }) 
        : null 
      }

    </div>
  );
}

export default App;
