const userSelect = document.getElementById('userSelect');
const userInfo = document.getElementById('userInfo');
const todoList = document.getElementById('todoList');
const todoDetails = document.getElementById('todoDetails');

let allUsers = []; 


fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(users => {
    allUsers = users; 
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.name;
      userSelect.appendChild(option);
    });
  })


  .catch(error => {
    console.error('Fel vid hämtning av användare:', error);
  });



userSelect.addEventListener('change', () => {
  const selectedUser = userSelect.value;

  if (!selectedUser) {
    userInfo.innerHTML = '';
    todoList.innerHTML = '';
    todoDetails.innerHTML = '';
    return;
  }

  
  const user = allUsers.find(u => u.id == selectedUser);

 //visa användar infon//



  
  fetch(`https://jsonplaceholder.typicode.com/todos/?userId=${selectedUser}`)
    .then(response => response.json())
    .then(todos => {
      todoList.innerHTML = '';
      todoDetails.innerHTML = '';

      todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = `Todo ID: ${todo.id}`;
        li.style.cursor = 'pointer';

        li.addEventListener('click', () => {
          showTodoDetails(todo);
        });

        todoList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Fel vid hämtning av todos:', error);
    });
});


function showTodoDetails(todo) {
  todoDetails.innerHTML = `
    <h3>Detaljer för Todo:</h3>
    <p><strong>ID:</strong> ${todo.id}</p>
    <p><strong>Titel:</strong> ${todo.title}</p>
    <p><strong>Slutförd:</strong> ${todo.completed ? 'Ja' : 'Nej'}</p>
  `;
}
